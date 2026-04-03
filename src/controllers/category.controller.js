import Category from "../models/category.model.js";
import asyncHandler from "../utils/async-handler.js";

export const getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories });
});

export const createCategory = asyncHandler(async (req, res) => {
    const { name, slug } = req.body;

    if (!name?.trim()) {
        return res.status(400).json({ success: false, message: "Category name is required" });
    }

    if (!slug?.trim()) {
        return res.status(400).json({ success: false, message: "Category slug is required" });
    }

    const existing = await Category.findOne({ slug });

    if (existing) {
        return res.status(400).json({ success: false, message: "Category already exists" });
    }

    const category = await Category.create({
        name: name.trim(),
        slug: slug.trim(),
    });
    res.status(201).json({ success: true, category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findOneAndDelete({ slug: req.params.slug });

    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, message: "Category deleted" });
});
