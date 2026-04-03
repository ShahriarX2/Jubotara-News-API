import express from "express";
import {
    createCategory,
    deleteCategory,
    getCategories,
} from "../controllers/category.controller.js";
import authMiddleware, { requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", authMiddleware, requireAdmin, createCategory);
router.delete("/:slug", authMiddleware, requireAdmin, deleteCategory);

export default router;
