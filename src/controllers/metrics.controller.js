import News from "../models/news.model.js";
import User from "../models/user.model.js";
import Video from "../models/video.model.js";
import asyncHandler from "../utils/async-handler.js";

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
