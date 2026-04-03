import News from "../models/news.model.js";
import asyncHandler from "../utils/async-handler.js";
import uploadBufferToCloudinary from "../utils/cloudinary.js";
import { isAdminRole } from "../middleware/auth.middleware.js";

// Create News
export const createNews = asyncHandler(async (req, res) => {
    const uploadedFile =
        req.files?.image?.[0] ??
        req.files?.imageSrc?.[0] ??
        req.file;

    if (uploadedFile) {
        const result = await uploadBufferToCloudinary(uploadedFile.buffer);
        req.body.imageSrc = result.secure_url;
    }

    const payload = {
        ...req.body,
        authorId: req.user.id,
        authorName: req.body.authorName || req.user.name,
    };

    if (!isAdminRole(req.user.role)) {
        payload.status = "pending";
    }

    const news = await News.create(payload);
    res.status(201).json({ success: true, data: news });
});

// Get All News
export const getNews = asyncHandler(async (req, res) => {
    const page = Number.parseInt(req.query.page || "1", 10);
    const limit = Number.parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const requestedStatus = req.query.status;
    const query = {};

    if (requestedStatus && requestedStatus !== "all") {
        query.status = requestedStatus;
    } else if (!requestedStatus || !req.user) {
        query.status = "published";
    }

    if (category && category !== "all") {
        query.category = decodeURIComponent(category);
    }

    if (requestedStatus && req.user && !isAdminRole(req.user.role) && requestedStatus !== "published") {
        query.authorId = req.user.id;
    }

    const [newsheadline, totalCount, filteredCount, news] = await Promise.all([
        News.find({ status: "published" }, "headline").sort({ publishedAt: -1 }).limit(20).lean(),
        News.countDocuments({ status: "published" }),
        News.countDocuments(query),
        News.find(query)
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
    ]);

    res.json({
        success: true,
        data: news,
        newsheadline,
        totalCount,
        filteredCount,
        currentPage: page,
        totalPages: Math.ceil(filteredCount / limit) || 1,
    });
});

export const searchNews = asyncHandler(async (req, res) => {
    const q = req.query.q?.trim();

    if (!q) {
        return res.json({ success: true, data: [] });
    }

    const news = await News.find({
        status: "published",
        $or: [
            { headline: { $regex: q, $options: "i" } },
            { content: { $regex: q, $options: "i" } },
            { category: { $regex: q, $options: "i" } },
        ],
    })
        .sort({ publishedAt: -1 })
        .limit(20)
        .lean();

    res.json({ success: true, data: news });
});

export const getNewsById = asyncHandler(async (req, res) => {
    const news = await News.findById(req.params.id);

    if (!news) {
        return res.status(404).json({ error: "News not found" });
    }

    res.json(news);
});

export const updateNews = asyncHandler(async (req, res) => {
    const existingNews = await News.findById(req.params.id);

    if (!existingNews) {
        return res.status(404).json({ error: "News not found" });
    }

    if (!isAdminRole(req.user.role)) {
        if (existingNews.authorId?.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (existingNews.status === "published") {
            return res.status(403).json({ message: "Cannot edit published news. Please contact admin." });
        }

        delete req.body.status;
        delete req.body.approvedBy;
    }
    if (req.body.status === "published" && !existingNews.approvedBy) {
        existingNews.approvedBy = req.user.id;
    }

    Object.assign(existingNews, req.body);
    const updated = await existingNews.save();

    res.json(updated);
});

export const deleteNews = asyncHandler(async (req, res) => {
    const existingNews = await News.findById(req.params.id);

    if (!existingNews) {
        return res.status(404).json({ error: "News not found" });
    }

    if (!isAdminRole(req.user.role)) {
        if (existingNews.authorId?.toString() !== req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (existingNews.status === "published") {
            return res.status(403).json({ message: "Cannot delete published news." });
        }
    }

    await News.findByIdAndDelete(req.params.id);
    res.json({ success: true, id: req.params.id });
});
