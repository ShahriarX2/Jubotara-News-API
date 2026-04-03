import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["administrator", "admin", "author", "reporter", "user"],
        default: "user",
    },
    isActivated: {
        type: Boolean,
        default: false,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
    activationToken: {
        type: String,
    },
    activationDate: {
        type: Date,
    },
    activationTokenExpires: {
        type: Date,
    },
    activationExpires: {
        type: Date,
    }
}, { timestamps: true });

export default mongoose.models.User || mongoose.model("User", userSchema);
