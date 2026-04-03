import asyncHandler from "../utils/async-handler.js";
import uploadBufferToCloudinary from "../utils/cloudinary.js";

export const uploadFile = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const uploaded = await uploadBufferToCloudinary(req.file.buffer);

    res.json({
        success: true,
        secure_url: uploaded.secure_url,
        public_id: uploaded.public_id,
    });
});
