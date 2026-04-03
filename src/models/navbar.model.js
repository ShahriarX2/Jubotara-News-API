import mongoose from "mongoose";

const navbarSchema = new mongoose.Schema(
    {
        label: { type: String, required: true, trim: true },
        href: { type: String, required: true, trim: true },
        order: { type: Number, default: 0 },
        isExternal: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.models.Navbar || mongoose.model("Navbar", navbarSchema);
