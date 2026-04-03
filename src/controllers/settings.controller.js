import Settings from "../models/settings.model.js";
import asyncHandler from "../utils/async-handler.js";

export const getSettings = asyncHandler(async (req, res) => {
    const settings = await Settings.find({});
    const data = settings.reduce((acc, item) => {
        acc[item.key] = item.value;
        return acc;
    }, {});

    res.json({ success: true, data });
});

export const upsertSetting = asyncHandler(async (req, res) => {
    const { key, value, description } = req.body;

    if (!key) {
        return res.status(400).json({ success: false, message: "key is required" });
    }

    const setting = await Settings.findOneAndUpdate(
        { key },
        { value, description },
        { upsert: true, new: true, runValidators: true }
    );

    res.json({ success: true, data: setting });
});
