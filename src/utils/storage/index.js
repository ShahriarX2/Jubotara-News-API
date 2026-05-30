import Settings from "../../models/settings.model.js";
import { uploadToCloudinary, deleteFromCloudinary } from "./cloudinary.provider.js";
import { uploadToR2, deleteFromR2 } from "./r2.provider.js";
import path from "path";

export const uploadFile = async (file, options = {}) => {
    // Get active storage provider from settings
    const storageSetting = await Settings.findOne({ key: "active_storage_provider" });
    const provider = storageSetting?.value || process.env.DEFAULT_STORAGE_PROVIDER || "cloudinary";

    console.log(`[Storage] Using provider: ${provider} for file: ${file.originalname || "unnamed"}`);

    const uploadOptions = {
        ...options,
        extension: file.originalname ? path.extname(file.originalname) : ".jpg",
        mimetype: file.mimetype,
    };

    if (provider === "r2") {
        return await uploadToR2(file.buffer, uploadOptions);
    } else {
        return await uploadToCloudinary(file.buffer, uploadOptions);
    }
};

export const deleteFile = async (publicId, provider) => {
    if (!publicId) return;

    if (provider === "r2") {
        return await deleteFromR2(publicId);
    } else {
        return await deleteFromCloudinary(publicId);
    }
};

export default uploadFile;
