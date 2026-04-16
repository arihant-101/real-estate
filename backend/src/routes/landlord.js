import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.js";
import { requireLandlord } from "../middleware/requireLandlord.js";
import * as landlordPropertyService from "../services/landlordPropertyService.js";
import * as maintenanceRequestService from "../services/maintenanceRequestService.js";
import * as tenancyApplicationService from "../services/tenancyApplicationService.js";
import * as financialService from "../services/financialService.js";
import * as propertyViewService from "../services/propertyViewService.js";
import * as propertyAvailabilityService from "../services/propertyAvailabilityService.js";
import * as propertyAnalyticsService from "../services/propertyAnalyticsService.js";

const router = Router();
router.use(authMiddleware, requireLandlord);

const createPropertySchema = z.object({
  title: z.string().min(1),
  slug: z.string().optional(),
  description: z.string().optional(),
  address: z.string().min(1),
  city: z.string().min(1),
  postCode: z.string().optional(),
  areaId: z.string().uuid().optional().nullable(),
  listingType: z.enum(["RENTAL", "HOLIDAY_LET"]).default("RENTAL"),
  beds: z.coerce.number().int().min(0),
  baths: z.coerce.number().int().min(0),
  areaSqFt: z.coerce.number().int().min(0),
  pricePerMonth: z.coerce.number().min(0),
  isFeatured: z.boolean().optional(),
  imageUrl: z.string().url().optional(),
  imageUrls: z.array(z.string().url()).min(5, "At least 5 images required").max(10, "Maximum 10 images allowed").optional(),
});

const updatePropertySchema = createPropertySchema.partial().extend({
  status: z.enum(["DRAFT", "LIVE", "ARCHIVED"]).optional(),
  imageUrls: z.array(z.string().url()).min(1).max(10).optional(),
});

router.get("/maintenance-requests", async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 100;
    const items = await maintenanceRequestService.listByLandlord(req.user.id, limit);
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.patch("/maintenance-requests/:id", async (req, res, next) => {
  try {
    const body = z.object({ status: z.enum(["pending", "in_progress", "resolved"]) }).parse(req.body);
    const updated = await maintenanceRequestService.updateStatusForLandlord(
      req.params.id,
      req.user.id,
      body
    );
    res.json(updated);
  } catch (e) {
    if (e.code === "NOT_FOUND") {
      return res.status(404).json({ error: e.message, code: e.code });
    }
    if (e.code === "VALIDATION_ERROR" || e.name === "ZodError") {
      return res.status(400).json({ error: e.message || e.errors?.[0]?.message || "Validation failed", code: "VALIDATION_ERROR" });
    }
    next(e);
  }
});

router.get("/properties", async (req, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const result = await landlordPropertyService.listByLandlord(req.user.id, { page, limit });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/properties/:id/activity", async (req, res, next) => {
  try {
    const [views, maintenanceRequests, applications] = await Promise.all([
      propertyViewService.listByProperty(req.params.id, req.user.id, 50),
      maintenanceRequestService.listByProperty(req.params.id, req.user.id),
      tenancyApplicationService.listByProperty(req.params.id, req.user.id),
    ]);
    res.json({ views, maintenanceRequests, applications });
  } catch (e) {
    if (e.code === "NOT_FOUND") return res.status(404).json({ error: e.message, code: e.code });
    next(e);
  }
});

router.get("/properties/:id/analytics", async (req, res, next) => {
  try {
    const data = await propertyAnalyticsService.getPropertyAnalytics(req.params.id, req.user.id);
    res.json(data);
  } catch (e) {
    if (e.code === "NOT_FOUND") return res.status(404).json({ error: e.message, code: e.code });
    next(e);
  }
});

router.get("/properties/:id/availability", async (req, res, next) => {
  try {
    const items = await propertyAvailabilityService.listByProperty(req.params.id, req.user.id);
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.post("/properties/:id/availability", async (req, res, next) => {
  try {
    const body = z.object({
      startDate: z.union([z.string(), z.coerce.date()]),
      endDate: z.union([z.string(), z.coerce.date()]),
    }).parse(req.body);
    const created = await propertyAvailabilityService.add(req.params.id, req.user.id, body);
    res.status(201).json(created);
  } catch (e) {
    if (e.code === "NOT_FOUND") return res.status(404).json({ error: e.message, code: e.code });
    if (e.code === "VALIDATION_ERROR" || e.name === "ZodError") {
      return res.status(400).json({ error: e.message || e.errors?.[0]?.message || "Validation failed", code: "VALIDATION_ERROR" });
    }
    next(e);
  }
});

router.delete("/properties/:id/availability/:availabilityId", async (req, res, next) => {
  try {
    await propertyAvailabilityService.remove(req.params.availabilityId, req.user.id);
    res.status(204).send();
  } catch (e) {
    if (e.code === "NOT_FOUND") return res.status(404).json({ error: e.message, code: e.code });
    next(e);
  }
});

router.get("/properties/:id/maintenance-requests", async (req, res, next) => {
  try {
    const items = await maintenanceRequestService.listByProperty(req.params.id, req.user.id);
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.get("/properties/:id/applications", async (req, res, next) => {
  try {
    const items = await tenancyApplicationService.listByProperty(req.params.id, req.user.id);
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.post("/applications/:id/approve", async (req, res, next) => {
  try {
    const app = await tenancyApplicationService.approve(req.params.id, req.user.id);
    res.json(app);
  } catch (e) {
    if (e.code === "NOT_FOUND") return res.status(404).json({ error: e.message, code: e.code });
    if (e.code === "VALIDATION_ERROR") return res.status(400).json({ error: e.message, code: e.code });
    next(e);
  }
});

router.post("/applications/:id/reject", async (req, res, next) => {
  try {
    const app = await tenancyApplicationService.reject(req.params.id, req.user.id);
    res.json(app);
  } catch (e) {
    if (e.code === "NOT_FOUND") return res.status(404).json({ error: e.message, code: e.code });
    if (e.code === "VALIDATION_ERROR") return res.status(400).json({ error: e.message, code: e.code });
    next(e);
  }
});

router.get("/financials/summary", async (req, res, next) => {
  try {
    const summary = await financialService.getLandlordFinancialSummary(req.user.id);
    res.json(summary);
  } catch (e) {
    next(e);
  }
});

router.get("/properties/:id/financials", async (req, res, next) => {
  try {
    const data = await financialService.getLandlordPropertyFinancials(req.params.id, req.user.id);
    res.json(data);
  } catch (e) {
    if (e.code === "NOT_FOUND") return res.status(404).json({ error: e.message, code: e.code });
    next(e);
  }
});

router.get("/properties/:id", async (req, res, next) => {
  try {
    const property = await landlordPropertyService.getOneForLandlord(req.params.id, req.user.id);
    res.json(property);
  } catch (e) {
    if (e.code === "NOT_FOUND") {
      res.status(404).json({ error: e.message, code: e.code });
      return;
    }
    next(e);
  }
});

router.post("/properties", async (req, res, next) => {
  try {
    const body = createPropertySchema.parse(req.body);
    const property = await landlordPropertyService.create(req.user.id, body);
    res.status(201).json(property);
  } catch (e) {
    if (e.name === "ZodError") {
      res.status(400).json({ error: e.errors?.[0]?.message || "Validation failed", code: "VALIDATION_ERROR" });
      return;
    }
    if (e.code === "VALIDATION_ERROR") {
      res.status(400).json({ error: e.message, code: e.code });
      return;
    }
    next(e);
  }
});

router.put("/properties/:id", async (req, res, next) => {
  try {
    const body = updatePropertySchema.parse(req.body);
    const property = await landlordPropertyService.update(req.params.id, req.user.id, body);
    res.json(property);
  } catch (e) {
    if (e.name === "ZodError") {
      res.status(400).json({ error: e.errors?.[0]?.message || "Validation failed", code: "VALIDATION_ERROR" });
      return;
    }
    if (e.code === "NOT_FOUND" || e.code === "VALIDATION_ERROR") {
      res.status(e.code === "NOT_FOUND" ? 404 : 400).json({ error: e.message, code: e.code });
      return;
    }
    next(e);
  }
});

export default router;
