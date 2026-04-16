import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.js";
import { requireTenant } from "../middleware/requireTenant.js";
import { prisma } from "../lib/prisma.js";
import * as maintenanceRequestService from "../services/maintenanceRequestService.js";
import * as tenancyApplicationService from "../services/tenancyApplicationService.js";
import * as financialService from "../services/financialService.js";
import { REPAIR_LEAF_IDS_REQUIRING_PHOTOS } from "../constants/repairPhotoRules.js";

const router = Router();
router.use(authMiddleware, requireTenant);

const dataUrlPhoto = z
  .string()
  .max(3_500_000)
  .refine(
    (s) => /^data:image\/(jpeg|jpg|png|webp);base64,/i.test(s),
    "Each photo must be a valid image (JPEG, PNG, or WebP)"
  );

const createRequestSchema = z
  .object({
    issueCategory: z.string().min(1, "Issue category is required"),
    description: z.string().min(1, "Description is required"),
    urgency: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
    channel: z.enum(["GENERAL", "REPAIRS_WIZARD"]).optional(),
    roomOrFlat: z.string().optional(),
    fullAddress: z.string().max(2000).optional(),
    contactPhone: z.string().max(40).optional(),
    repairsAccessPreference: z.enum(["ABSENT_OK", "TENANT_PRESENT"]).optional(),
    repairsAlarmInfo: z.string().max(500).optional(),
    repairsParkingInfo: z.string().max(500).optional(),
    repairsPetInfo: z.string().max(500).optional(),
    repairsFurtherNotes: z.string().max(2000).optional(),
    vulnerableOccupier: z.boolean().optional(),
    repairsConsentAccepted: z.boolean().optional(),
    issuePath: z.array(z.string()).optional(),
    photoAttachments: z.array(dataUrlPhoto).max(4).optional(),
    /** Last taxonomy leaf id; used with REPAIR_LEAF_IDS_REQUIRING_PHOTOS for server-side photo rules */
    repairLeafId: z.string().optional(),
    /** Free-text building/property when submitting via POST /maintenance-requests (repairs wizard) */
    buildingOrProperty: z.string().max(500).optional(),
  })
  .refine(
    (data) => data.channel !== "REPAIRS_WIZARD" || !!(data.repairLeafId && String(data.repairLeafId).trim()),
    { message: "repairLeafId is required for this request", path: ["repairLeafId"] }
  )
  .refine(
    (data) => data.channel !== "REPAIRS_WIZARD" || !!(data.roomOrFlat && String(data.roomOrFlat).trim()),
    { message: "Room or flat number is required", path: ["roomOrFlat"] }
  )
  .refine(
    (data) =>
      data.channel !== "REPAIRS_WIZARD" || !!(data.fullAddress && String(data.fullAddress).trim().length >= 8),
    { message: "Please enter your full address (at least 8 characters)", path: ["fullAddress"] }
  )
  .refine(
    (data) =>
      data.channel !== "REPAIRS_WIZARD" || !!(data.contactPhone && String(data.contactPhone).trim().length >= 6),
    { message: "Please enter a valid phone number", path: ["contactPhone"] }
  )
  .refine(
    (data) => data.channel !== "REPAIRS_WIZARD" || data.repairsConsentAccepted === true,
    {
      message: "You must agree to the Terms of Service and Privacy Policy to submit this report",
      path: ["repairsConsentAccepted"],
    }
  )
  .refine(
    (data) => {
      const channel = data.channel ?? "GENERAL";
      const photos = data.photoAttachments ?? [];
      if (channel !== "REPAIRS_WIZARD" || !data.repairLeafId || !REPAIR_LEAF_IDS_REQUIRING_PHOTOS.has(data.repairLeafId)) {
        return true;
      }
      return photos.length >= 1;
    },
    { message: "At least one photo is required for this issue type", path: ["photoAttachments"] }
  );

async function persistTenantMaintenanceRequest(req, res, body, { property, propertyId }) {
  const channel = body.channel ?? maintenanceRequestService.CHANNEL_GENERAL;
  const address =
    property != null
      ? `${property.address}, ${property.city}${property.postCode ? " " + property.postCode : ""}`
      : String(body.buildingOrProperty ?? "").trim();
  const descParts = [];
  if (body.issuePath?.length) descParts.push(`Path: ${body.issuePath.join(" › ")}`);
  if (body.roomOrFlat?.trim()) descParts.push(`Room/flat: ${body.roomOrFlat.trim()}`);
  if (body.fullAddress?.trim()) descParts.push(`Tenant full address:\n${body.fullAddress.trim()}`);
  if (body.contactPhone?.trim()) descParts.push(`Contact phone: ${body.contactPhone.trim()}`);
  if (channel === "REPAIRS_WIZARD") {
    if (body.repairsAccessPreference === "ABSENT_OK") {
      descParts.push(
        "Access: Tenant authorises contractors to access the property to carry out this repair without the tenant being present (subject to any alarm / entry notes below)."
      );
    } else if (body.repairsAccessPreference === "TENANT_PRESENT") {
      descParts.push("Access: Tenant requests to be present when the work is carried out.");
    }
    if (body.repairsAlarmInfo?.trim()) descParts.push(`Alarm / entry information: ${body.repairsAlarmInfo.trim()}`);
    if (body.repairsParkingInfo?.trim()) descParts.push(`Parking restrictions: ${body.repairsParkingInfo.trim()}`);
    if (body.repairsPetInfo?.trim()) descParts.push(`Pet information: ${body.repairsPetInfo.trim()}`);
    if (body.repairsFurtherNotes?.trim()) descParts.push(`Further notes: ${body.repairsFurtherNotes.trim()}`);
    descParts.push(`Vulnerable occupier reported: ${body.vulnerableOccupier ? "Yes" : "No"}`);
    descParts.push("Tenant confirmed agreement to the Terms of Service and Privacy Policy for this repair report.");
  }
  descParts.push(body.description);
  const fullDescription = descParts.join("\n\n");
  const photos = body.photoAttachments ?? [];
  const photoAttachmentsJson = photos.length > 0 ? JSON.stringify(photos) : null;

  const record = await maintenanceRequestService.createMaintenanceRequest({
    tenantName: req.user.name || req.user.email,
    tenantEmail: req.user.email,
    propertyAddressOrRef: address,
    issueCategory: body.issueCategory,
    description: fullDescription,
    urgency: body.urgency || "MEDIUM",
    propertyId: propertyId ?? undefined,
    tenantId: req.user.id,
    channel,
    photoAttachments: photoAttachmentsJson,
  });
  res.status(201).json({ id: record.id, message: "Maintenance request submitted successfully" });
}

router.get("/maintenance-requests", async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const items = await maintenanceRequestService.listByTenant(req.user.id, limit);
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.post("/maintenance-requests", async (req, res, next) => {
  try {
    const body = createRequestSchema.parse(req.body);
    if (body.channel !== maintenanceRequestService.CHANNEL_REPAIRS_WIZARD) {
      return res.status(400).json({
        error: "Use this endpoint only for guided repair reports, or submit via your property in the portal.",
        code: "VALIDATION_ERROR",
      });
    }
    const building = String(body.buildingOrProperty ?? "").trim();
    if (building.length < 2) {
      return res.status(400).json({
        error: "Enter the building or property (at least 2 characters).",
        code: "VALIDATION_ERROR",
      });
    }
    await persistTenantMaintenanceRequest(req, res, { ...body, buildingOrProperty: building }, { property: null, propertyId: null });
  } catch (e) {
    if (e.name === "ZodError") {
      const msg = e.issues?.[0]?.message || e.errors?.[0]?.message || "Validation failed";
      return res.status(400).json({ error: msg, code: "VALIDATION_ERROR" });
    }
    next(e);
  }
});

router.post("/properties/:propertyId/maintenance-requests", async (req, res, next) => {
  try {
    const { propertyId } = req.params;
    const body = createRequestSchema.parse(req.body);
    const property = await prisma.property.findFirst({
      where: { id: propertyId },
    });
    if (!property) {
      return res.status(404).json({ error: "Property not found", code: "NOT_FOUND" });
    }
    await persistTenantMaintenanceRequest(req, res, body, { property, propertyId });
  } catch (e) {
    if (e.name === "ZodError") {
      const msg = e.issues?.[0]?.message || e.errors?.[0]?.message || "Validation failed";
      return res.status(400).json({ error: msg, code: "VALIDATION_ERROR" });
    }
    next(e);
  }
});

router.get("/applications", async (req, res, next) => {
  try {
    const items = await tenancyApplicationService.listByTenant(req.user.id);
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.get("/financials", async (req, res, next) => {
  try {
    const data = await financialService.getTenantFinancials(req.user.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
});

export default router;
