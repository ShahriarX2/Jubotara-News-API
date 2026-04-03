import mongoose, { Schema } from "mongoose";

const newsSchema = new Schema({
    headline: {
        type: String,
        required: true,
    },
    reporterInfo: {
        type: String,
        required: false, // Optional
    },
    content: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    imageSrc: {
        type: String,
        required: true,
    },
    imageCaption: {
        type: String,
        required: false, // Optional
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    status: {
        type: String,
        enum: ['published', 'pending', 'draft'],
        default: 'pending',
    },
    approvedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

export default mongoose.model("News", newsSchema);