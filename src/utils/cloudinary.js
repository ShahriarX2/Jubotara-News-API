import cloudinary from "../config/cloudinary.js";

export const uploadBufferToCloudinary = (buffer, options = {}) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "jubotara-news", ...options },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve(result);
            }
        );

        stream.end(buffer);
    });

export default uploadBufferToCloudinary;
