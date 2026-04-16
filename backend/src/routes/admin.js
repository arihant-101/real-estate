import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.js";
import * as testimonialService from "../services/testimonialService.js";
import * as adminAnalyticsService from "../services/adminAnalyticsService.js";
import * as maintenanceRequestService from "../services/maintenanceRequestService.js";

const router = Router();
router.use(authMiddleware);

function requireAdmin(req, res, next) {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required", code: "FORBIDDEN" });
  }
  next();
}

router.get("/repairs", requireAdmin, async (req, res, next) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 100;
    const items = await maintenanceRequestService.listRepairsWizardForAdmin(limit);
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.patch("/maintenance-requests/:id", requireAdmin, async (req, res, next) => {
  try {
    const body = z.object({ status: z.enum(["pending", "in_progress", "resolved"]) }).parse(req.body);
    const updated = await maintenanceRequestService.updateStatusForAdmin(req.params.id, body);
    res.json(updated);
  } catch (e) {
    if (e.name === "ZodError") {
      const msg = e.issues?.[0]?.message || e.errors?.[0]?.message || "Validation failed";
      return res.status(400).json({ error: msg, code: "VALIDATION_ERROR" });
    }
    if (e.code === "NOT_FOUND") {
      return res.status(404).json({ error: e.message, code: e.code });
    }
    if (e.code === "VALIDATION_ERROR") {
      return res.status(400).json({ error: e.message, code: e.code });
    }
    next(e);
  }
});

router.get("/analytics", requireAdmin, async (req, res, next) => {
  try {
    const stats = await adminAnalyticsService.getDashboardStats();
    res.json(stats);
  } catch (e) {
    next(e);
  }
});

router.get("/testimonials", requireAdmin, async (req, res, next) => {
  try {
    const approved = req.query.approved;
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const items = approved === "false" || approved === false
      ? await testimonialService.listPending(limit)
      : [];
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.patch("/testimonials/:id", requireAdmin, async (req, res, next) => {
  try {
    const { isApproved } = req.body;
    if (typeof isApproved !== "boolean") {
      return res.status(400).json({ error: "isApproved must be a boolean", code: "VALIDATION_ERROR" });
    }
    const updated = await testimonialService.updateApproval(req.params.id, isApproved);
    res.json(updated);
  } catch (e) {
    if (e.code === "P2025") {
      return res.status(404).json({ error: "Testimonial not found", code: "NOT_FOUND" });
    }
    next(e);
  }
});

export default router;
