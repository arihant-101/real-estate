import { Router } from "express";
import { z } from "zod";
import * as maintenanceRequestService from "../services/maintenanceRequestService.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

const requestSchema = z.object({
  tenantName: z.string().min(1, "Name is required"),
  tenantEmail: z.string().email("Valid email is required"),
  propertyAddressOrRef: z.string().min(1, "Property address or reference is required"),
  issueCategory: z.string().min(1, "Issue category is required"),
  description: z.string().min(1, "Description is required"),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  propertyId: z.string().uuid().optional(),
});

router.post("/", async (req, res, next) => {
  try {
    const body = requestSchema.parse(req.body);
    const record = await maintenanceRequestService.createMaintenanceRequest(body);
    res.status(201).json({ id: record.id, message: "Maintenance request submitted successfully" });
  } catch (e) {
    if (e.name === "ZodError") {
      const msg = e.errors?.[0]?.message || "Validation failed";
      return res.status(400).json({ error: msg, code: "VALIDATION_ERROR" });
    }
    next(e);
  }
});

// Admin-only: list recent maintenance requests for dashboard
router.get("/", authMiddleware, async (req, res, next) => {
  try {
    if (req.user.role !== "ADMIN") {
      return res.status(403).json({ error: "Forbidden", code: "FORBIDDEN" });
    }
    const limit = req.query.limit;
    const items = await maintenanceRequestService.listRecentMaintenanceRequests(limit);
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

export default router;
