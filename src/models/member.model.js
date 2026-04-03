import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        designation: { type: String, required: true, trim: true },
        image: { type: String, required: true },
        section: { type: String, required: true, trim: true },
        isHead: { type: Boolean, default: false },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.models.Member || mongoose.model("Member", memberSchema);
