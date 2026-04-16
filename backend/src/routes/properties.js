import { Router } from "express";
import * as propertyService from "../services/propertyService.js";
import * as propertyViewService from "../services/propertyViewService.js";
import * as propertyAvailabilityService from "../services/propertyAvailabilityService.js";
import { optionalAuth } from "../middleware/optionalAuth.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const result = await propertyService.listProperties({
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 12,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      beds: req.query.beds,
      areaId: req.query.areaId,
      listingType: req.query.listingType,
      featured: req.query.featured,
      search: req.query.search,
    });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/:id/availability", async (req, res, next) => {
  try {
    const items = await propertyAvailabilityService.listAvailableForTenant(req.params.id);
    res.json({ items });
  } catch (e) {
    next(e);
  }
});

router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    const property = await propertyService.getPropertyById(req.params.id);
    propertyViewService.recordPropertyView(req.params.id, req.user?.id ?? null).catch(() => {});
    res.json(property);
  } catch (e) {
    next(e);
  }
});

export default router;
