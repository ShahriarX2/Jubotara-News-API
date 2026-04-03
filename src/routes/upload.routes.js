import express from "express";
import { uploadFile } from "../controllers/upload.controller.js";
import authMiddleware, { requireWriter } from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/", authMiddleware, requireWriter, upload.single("file"), uploadFile);

export default router;
