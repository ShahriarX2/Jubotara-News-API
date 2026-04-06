import Category from "../models/category.model.js";
import News from "../models/news.model.js";
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

export const updateCategory = asyncHandler(async (req, res) => {
    const { name, slug: newSlug } = req.body;
    const { id } = req.params;

    const category = await Category.findById(id);

    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
    }

    const oldName = category.name;

    if (name) {
        category.name = name.trim();
    }
    if (newSlug) {
        if (newSlug !== category.slug) {
            const existing = await Category.findOne({ slug: newSlug });
            if (existing) {
                return res.status(400).json({ success: false, message: "New slug already in use" });
            }
        }
        category.slug = newSlug.trim();
    }

    await category.save();

    // If name changed, update all news entries
    if (name && name.trim() !== oldName) {
        await News.updateMany({ category: oldName }, { category: name.trim() });
    }

    res.json({ success: true, category });
});

export const deleteCategory = asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({ success: true, message: "Category deleted" });
});
