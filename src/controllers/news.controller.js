import News from "../models/news.model.js";
import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "jubotara-news" },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            }
        );

        stream.end(buffer);
    });

// Create News
export const createNews = async (req, res) => {
    try {
        const uploadedFile =
            req.files?.image?.[0] ??
            req.files?.imageSrc?.[0] ??
            req.file;

        if (uploadedFile) {
            const result = await uploadToCloudinary(uploadedFile.buffer);
            req.body.imageSrc = result.secure_url;
        }

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
