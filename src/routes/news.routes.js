import express from "express";
import {
    createNews,
    deleteNews,
    getNews,
    getNewsById,
    searchNews,
    updateNews,
} from "../controllers/news.controller.js";
import upload from "../middleware/upload.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/async-handler.js";

const router = express.Router();

router.get(
    "/",
    asyncHandler(async (req, res, next) => {
        if (req.headers.authorization?.startsWith("Bearer ")) {
            return authMiddleware(req, res, next);
        }

        next();
    }),
    getNews
);
router.get("/search", searchNews);
router.get("/:id", getNewsById);
router.post(
    "/",
    authMiddleware,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "imageSrc", maxCount: 1 },
    ]),
    createNews
);
router.put("/:id", authMiddleware, updateNews);
router.delete("/:id", authMiddleware, deleteNews);

export default router;
