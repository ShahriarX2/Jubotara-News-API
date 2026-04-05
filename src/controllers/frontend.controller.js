import asyncHandler from "../utils/async-handler.js";
import News from "../models/news.model.js";
import Category from "../models/category.model.js";
import Settings from "../models/settings.model.js";
import Navbar from "../models/navbar.model.js";
import Logo from "../models/logo.model.js";
import Member from "../models/member.model.js";
import Video from "../models/video.model.js";
import {
    serializeNews,
    serializeCategory,
    serializeSetting,
    serializeLogo,
    serializeMenu,
    serializeMember,
    serializeVideo,
} from "../utils/serializers.js";

export const getFrontendSettings = asyncHandler(async (req, res) => {
    const settings = await Settings.find();
    res.json({
        success: true,
        data: settings.map(serializeSetting),
    });
});

export const getFrontendMenu = asyncHandler(async (req, res) => {
    const menus = await Navbar.find().sort({ order: 1 });
    res.json({
        success: true,
        data: menus.map(serializeMenu),
    });
});

export const getFrontendLogo = asyncHandler(async (req, res) => {
    const logo = await Logo.findOne();
    res.json({
        success: true,
        data: logo ? serializeLogo(logo) : {},
    });
});

export const getFrontendNews = asyncHandler(async (req, res) => {
    const { page = 1, per_page = 10, category_slug, featured, search } = req.query;

    const query = { status: "published" };

    if (category_slug) {
        // Find category by slug first
        const category = await Category.findOne({ slug: category_slug });
        if (category) {
            query.category = category.name; // News model uses category name as string
        } else {
            // If category not found, return empty data
            return res.json({
                success: true,
                data: [],
                meta: {
                    page: parseInt(page),
                    perPage: parseInt(per_page),
                    total: 0,
                    totalPages: 0,
                },
            });
        }
    }

    if (featured === "true") {
        query.isFeatured = true;
    }

    if (search) {
        query.headline = { $regex: search, $options: "i" };
    }

    const total = await News.countDocuments(query);
    const totalPages = Math.ceil(total / per_page);

    const news = await News.find(query)
        .sort({ publishedAt: -1 })
        .skip((page - 1) * per_page)
        .limit(parseInt(per_page));

    res.json({
        success: true,
        data: news.map(serializeNews),
        meta: {
            page: parseInt(page),
            perPage: parseInt(per_page),
            total,
            totalPages,
        },
    });
});

export const getFrontendNewsBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const news = await News.findOne({ slug, status: "published" });

    if (!news) {
        return res.status(404).json({ success: false, message: "News not found" });
    }

    // Increment views count
    news.viewsCount = (news.viewsCount || 0) + 1;
    await news.save();

    res.json({
        success: true,
        data: serializeNews(news),
    });
});

export const getRelatedNews = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const { limit = 4 } = req.query;

    const news = await News.findOne({ slug, status: "published" });

    if (!news) {
        return res.status(404).json({ success: false, message: "News not found" });
    }

    const relatedNews = await News.find({
        status: "published",
        category: news.category,
        _id: { $ne: news._id },
    })
        .sort({ publishedAt: -1 })
        .limit(parseInt(limit));

    res.json({
        success: true,
        data: relatedNews.map(serializeNews),
    });
});

export const getTrendingNews = asyncHandler(async (req, res) => {
    const { limit = 5 } = req.query;

    const news = await News.find({ status: "published" })
        .sort({ viewsCount: -1, publishedAt: -1 })
        .limit(parseInt(limit));

    res.json({
        success: true,
        data: news.map(serializeNews),
    });
});

export const getFrontendCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find();
    res.json({
        success: true,
        data: categories.map(serializeCategory),
    });
});

export const getFrontendCategoryBySlug = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const category = await Category.findOne({ slug });

    if (!category) {
        return res.status(404).json({ success: false, message: "Category not found" });
    }

    res.json({
        success: true,
        data: serializeCategory(category),
    });
});

export const getFrontendTeam = asyncHandler(async (req, res) => {
    const members = await Member.find().sort({ order: 1 });
    res.json({
        success: true,
        data: members.map(serializeMember),
    });
});

export const getFrontendVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json({
        success: true,
        data: videos.map(serializeVideo),
    });
});

export const searchFrontendNews = asyncHandler(async (req, res) => {
    const { q, page = 1, per_page = 10 } = req.query;

    const query = {
        status: "published",
        $or: [
            { headline: { $regex: q, $options: "i" } },
            { content: { $regex: q, $options: "i" } },
        ],
    };

    const total = await News.countDocuments(query);
    const totalPages = Math.ceil(total / per_page);

    const news = await News.find(query)
        .sort({ publishedAt: -1 })
        .skip((page - 1) * per_page)
        .limit(parseInt(per_page));

    res.json({
        success: true,
        data: news.map(serializeNews),
        meta: {
            page: parseInt(page),
            perPage: parseInt(per_page),
            total,
            totalPages,
        },
    });
});
