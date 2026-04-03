import express from "express";
import {
    createVideo,
    deleteVideo,
    getVideos,
} from "../controllers/video.controller.js";
import authMiddleware, { requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getVideos);
router.post("/", authMiddleware, requireAdmin, createVideo);
router.delete("/:id", authMiddleware, requireAdmin, deleteVideo);

export default router;
