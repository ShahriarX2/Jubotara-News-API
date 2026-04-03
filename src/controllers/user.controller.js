import User from "../models/user.model.js";
import asyncHandler from "../utils/async-handler.js";

export const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    const totalUser = await User.countDocuments({});
    res.json({ users, totalUser });
});

export const updateUserRole = asyncHandler(async (req, res) => {
    const { role } = req.body;

    if (!role) {
        return res.status(400).json({ message: "Role is required" });
    }

    const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
    );

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, user });
});
