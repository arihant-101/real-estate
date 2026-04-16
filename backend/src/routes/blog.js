import { Router } from "express";
import * as blogService from "../services/blogService.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const result = await blogService.listPosts(page, limit);
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/:slug", async (req, res, next) => {
  try {
    const post = await blogService.getPostBySlug(req.params.slug);
    res.json(post);
  } catch (e) {
    next(e);
  }
});

export default router;
