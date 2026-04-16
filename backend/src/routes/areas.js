import { Router } from "express";
import * as areaService from "../services/areaService.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const areas = await areaService.listAreas();
    res.json(areas);
  } catch (e) {
    next(e);
  }
});

export default router;
