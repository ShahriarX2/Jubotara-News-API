import express from "express";
import {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory,
} from "../controllers/category.controller.js";
import authMiddleware, { requireAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getCategories);
router.post("/", authMiddleware, requireAdmin, createCategory);
router.put("/:id", authMiddleware, requireAdmin, updateCategory);
router.delete("/:id", authMiddleware, requireAdmin, deleteCategory);

export default router;
