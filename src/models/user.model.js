import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["administrator", "admin", "author", "reporter"],
        default: "reporter", // future: editor, reporter
    },
    isActivated: {
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
    }
}, { timestamps: true });

export default mongoose.model("User", userSchema);