import express from "express";
import {
    createNews,
    deleteNews,
    getNews,
    getNewsById,
    resolveSlugById,
    searchNews,
    updateNews,
} from "../controllers/news.controller.js";
import upload from "../middleware/upload.middleware.js";
import authMiddleware from "../middleware/auth.middleware.js";
import asyncHandler from "../utils/async-handler.js";

const router = express.Router();

/** Multer only for multipart; JSON PUTs stay on express.json() body. */
const newsImageUpload = upload.fields([
    { name: "image", maxCount: 1 },
    { name: "imageSrc", maxCount: 1 },
]);

const multipartNewsFields = (req, res, next) => {
    const ct = req.headers["content-type"] || "";
    if (ct.includes("multipart/form-data")) {
        return newsImageUpload(req, res, next);
    }
    next();
};

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
router.get("/resolve-slug/:id", resolveSlugById);
router.get("/:id", getNewsById);
router.post("/", authMiddleware, newsImageUpload, createNews);
router.put("/:id", authMiddleware, multipartNewsFields, updateNews);
router.delete("/:id", authMiddleware, deleteNews);

export default router;
