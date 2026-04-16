import { Router } from "express";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.js";
import * as authService from "../services/authService.js";

const router = Router();

const loginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).optional(),
  role: z.enum(["LANDLORD", "TENANT"]).optional(),
});

router.post("/login", async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);
    const result = await authService.login(body);
    res.json(result);
  } catch (e) {
    if (e.name === "ZodError") {
      res.status(400).json({ error: e.errors?.[0]?.message || "Validation failed", code: "VALIDATION_ERROR" });
      return;
    }
    next(e);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);
    const result = await authService.register(body);
    res.status(201).json(result);
  } catch (e) {
    if (e.name === "ZodError") {
      res.status(400).json({ error: e.errors?.[0]?.message || "Validation failed", code: "VALIDATION_ERROR" });
      return;
    }
    next(e);
  }
});

router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (e) {
    next(e);
  }
});

export default router;
