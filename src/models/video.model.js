import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        youtubeUrl: { type: String, required: true },
        videoId: { type: String, required: true },
    },
    { timestamps: true }
);

export default mongoose.models.Video || mongoose.model("Video", videoSchema);
