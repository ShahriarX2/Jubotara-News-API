import News from "../models/news.model.js";

// Create News
export const createNews = async (req, res) => {
    try {
        const news = await News.create(req.body);
        res.status(201).json(news);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get All News
export const getNews = async (req, res) => {
    try {
        const news = await News.find().sort({ createdAt: -1 });
        res.json(news);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};