import Member from "../models/member.model.js";
import asyncHandler from "../utils/async-handler.js";

export const getMembers = asyncHandler(async (req, res) => {
    const members = await Member.find().sort({ order: 1, createdAt: -1 });
    res.json({ success: true, members });
});

export const createMember = asyncHandler(async (req, res) => {
    const { name, designation, image, section, isHead, order } = req.body;

    if (!name || !designation || !image || !section) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const member = await Member.create({ name, designation, image, section, isHead, order });
    res.status(201).json({ success: true, member });
});

export const updateMember = asyncHandler(async (req, res) => {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!member) {
        return res.status(404).json({ success: false, message: "Member not found" });
    }

    res.json({ success: true, member });
});

export const deleteMember = asyncHandler(async (req, res) => {
    const member = await Member.findByIdAndDelete(req.params.id);

    if (!member) {
        return res.status(404).json({ success: false, message: "Member not found" });
    }

    res.json({ success: true, message: "Member deleted" });
});
