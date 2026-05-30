import News from "../models/news.model.js";
import User from "../models/user.model.js";
import Video from "../models/video.model.js";
import asyncHandler from "../utils/async-handler.js";
import { getCloudinaryUsage, getR2Usage } from "../utils/storage/metrics.js";

export const getAdminMetrics = asyncHandler(async (req, res) => {
    const [news, users, videos] = await Promise.all([
        News.countDocuments({}),
        User.countDocuments({}),
        Video.countDocuments({}),
    ]);

    res.json({
        success: true,
        data: { news, users, videos },
    });
});

export const getStorageUsage = asyncHandler(async (req, res) => {
    const [cloudinary, r2] = await Promise.all([
        getCloudinaryUsage(),
        getR2Usage(),
    ]);

    res.json({
        success: true,
        data: {
            cloudinary: cloudinary || { message: "Cloudinary metrics unavailable" },
            r2: r2 || { message: "Cloudflare R2 metrics unavailable (Check Account ID or API Token permissions)" },
        },
    });
});
