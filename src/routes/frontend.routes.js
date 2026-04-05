import { Router } from "express";
import {
    getFrontendSettings,
    getFrontendMenu,
    getFrontendLogo,
    getFrontendNews,
    getFrontendNewsBySlug,
    getRelatedNews,
    getTrendingNews,
    getFrontendCategories,
    getFrontendCategoryBySlug,
    getFrontendTeam,
    getFrontendVideos,
    searchFrontendNews,
} from "../controllers/frontend.controller.js";

const router = Router();

router.get("/settings", getFrontendSettings);
router.get("/menu", getFrontendMenu);
router.get("/logo", getFrontendLogo);
router.get("/news", getFrontendNews);
router.get("/news/search", searchFrontendNews);
router.get("/news/trending", getTrendingNews);
router.get("/news/:slug", getFrontendNewsBySlug);
router.get("/news/:slug/related", getRelatedNews);
router.get("/categories", getFrontendCategories);
router.get("/categories/:slug", getFrontendCategoryBySlug);
router.get("/team", getFrontendTeam);
router.get("/videos", getFrontendVideos);

export default router;
