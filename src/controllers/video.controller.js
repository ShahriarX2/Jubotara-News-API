import Video from "../models/video.model.js";
import asyncHandler from "../utils/async-handler.js";

const extractVideoId = (url = "") => {
    const regex = /(?:youtube\.com.*(?:\?|&)v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

export const getVideos = asyncHandler(async (req, res) => {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json({ success: true, data: videos });
});

export const createVideo = asyncHandler(async (req, res) => {
    const { title, youtubeUrl } = req.body;

    if (!title || !youtubeUrl) {
        return res.status(400).json({ error: "Title and YouTube URL required" });
    }

    const videoId = extractVideoId(youtubeUrl);

    if (!videoId) {
        return res.status(400).json({ error: "Invalid YouTube URL" });
    }

    const video = await Video.create({ title, youtubeUrl, videoId });
    res.status(201).json({ success: true, data: video });
});

export const deleteVideo = asyncHandler(async (req, res) => {
    const video = await Video.findByIdAndDelete(req.params.id);

    if (!video) {
        return res.status(404).json({ error: "Video not found" });
    }

    res.json({ success: true, message: "Video deleted successfully" });
});
