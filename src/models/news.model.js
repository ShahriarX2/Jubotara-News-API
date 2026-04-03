import mongoose, { Schema } from "mongoose";
import slugify from "../utils/slugify.js";

const newsSchema = new Schema({
    headline: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        unique: true,
        trim: true,
        index: true,
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
    authorName: {
        type: String,
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
    publishedAt: {
        type: Date,
        default: Date.now,
    },
    metaTitle: {
        type: String,
    },
    metaDescription: {
        type: String,
    },
    likesCount: {
        type: Number,
        default: 0,
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    comments: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
            userName: String,
            text: String,
            createdAt: {
                type: Date,
                default: Date.now,
            },
        }
    ],
}, { timestamps: true });

newsSchema.pre("save", async function () {
    if (!this.isModified("headline")) return;
    if (!this.slug) {
        this.slug = slugify(this.headline);
    }
});

newsSchema.index({ category: 1, status: 1, publishedAt: -1 });
newsSchema.index({ status: 1, publishedAt: -1 });
newsSchema.index({ isFeatured: 1, status: 1, publishedAt: -1 });

export default mongoose.models.News || mongoose.model("News", newsSchema);
