import { Router } from "express";
import { z } from "zod";
import { optionalAuth } from "../middleware/optionalAuth.js";
import * as tenancyApplicationService from "../services/tenancyApplicationService.js";

const router = Router();

const applicationSchema = z.object({
  propertyId: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  employment: z.string().optional(),
  references: z.string().optional(),
});

router.post("/applications", optionalAuth, async (req, res, next) => {
  try {
    const body = applicationSchema.parse(req.body);
    const applicantId = req.user?.role === "TENANT" ? req.user.id : undefined;
    if (applicantId) {
      body.name = body.name || req.user.name || req.user.email;
      body.email = body.email || req.user.email;
    }
    const app = await tenancyApplicationService.createApplication({
      ...body,
      applicantId,
    });
    res.status(201).json({ id: app.id, message: "Application submitted successfully" });
  } catch (e) {
    if (e.name === "ZodError") {
      return res.status(400).json({ error: e.errors?.[0]?.message || "Validation failed", code: "VALIDATION_ERROR" });
    }
    next(e);
  }
});

export default router;
