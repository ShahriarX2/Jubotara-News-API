import asyncHandler from "../utils/async-handler.js";
import { uploadFile as storageUpload } from "../utils/storage/index.js";

export const uploadFile = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const uploaded = await storageUpload(req.file);

    res.json({
        success: true,
        secure_url: uploaded.secure_url,
        public_id: uploaded.public_id,
        provider: uploaded.provider,
    });
});
