import Navbar from "../models/navbar.model.js";
import asyncHandler from "../utils/async-handler.js";

export const getNavbarItems = asyncHandler(async (req, res) => {
    const items = await Navbar.find().sort({ order: 1, createdAt: 1 });
    res.json({ success: true, data: items });
});

export const createNavbarItem = asyncHandler(async (req, res) => {
    const item = await Navbar.create(req.body);
    res.status(201).json({ success: true, data: item });
});

export const updateNavbarItem = asyncHandler(async (req, res) => {
    const item = await Navbar.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!item) {
        return res.status(404).json({ success: false, message: "Navbar item not found" });
    }

    res.json({ success: true, data: item });
});

export const deleteNavbarItem = asyncHandler(async (req, res) => {
    const item = await Navbar.findByIdAndDelete(req.params.id);

    if (!item) {
        return res.status(404).json({ success: false, message: "Navbar item not found" });
    }

    res.json({ success: true, message: "Navbar item deleted" });
});
