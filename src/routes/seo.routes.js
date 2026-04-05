import { Router } from "express";
import { getSitemap, getRssFeed } from "../controllers/seo.controller.js";

const router = Router();

router.get("/sitemap.xml", getSitemap);
router.get("/rss.xml", getRssFeed);

export default router;
