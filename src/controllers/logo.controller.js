import Logo from "../models/logo.model.js";
import asyncHandler from "../utils/async-handler.js";

export const getLogos = asyncHandler(async (req, res) => {
    const logos = await Logo.find().sort({ createdAt: -1 });
    res.json({ success: true, data: logos });
});

export const createLogo = asyncHandler(async (req, res) => {
    const { logoUrl, publicId } = req.body;

    if (!logoUrl) {
        return res.status(400).json({ success: false, message: "logoUrl is required" });
    }

    const logo = await Logo.create({ logoUrl, publicId: publicId || null });
    res.status(201).json({ success: true, data: logo });
});

export const deleteLogo = asyncHandler(async (req, res) => {
    const logo = await Logo.findByIdAndDelete(req.params.id);

    if (!logo) {
        return res.status(404).json({ success: false, message: "Logo not found" });
    }

    res.json({ success: true, message: "Logo deleted" });
});
