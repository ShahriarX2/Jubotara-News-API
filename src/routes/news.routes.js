import express from "express";
import { createNews, getNews } from "../controllers/news.controller.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post(
    "/",
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "imageSrc", maxCount: 1 },
    ]),
    createNews
);
router.get("/", getNews);

export default router;
