import cloudinary from "../../config/cloudinary.js";

export const uploadToCloudinary = (buffer, options = {}) =>
    new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "jubotara-news", ...options },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve({
                    secure_url: result.secure_url,
                    public_id: result.public_id,
                    provider: "cloudinary",
                });
            }
        );

        stream.end(buffer);
    });

export const deleteFromCloudinary = (publicId) =>
    new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(result);
        });
    });

export const listCloudinaryResources = (prefix = "jubotara-news/") =>
    new Promise((resolve, reject) => {
        cloudinary.api.resources(
            {
                type: "upload",
                prefix: prefix,
                max_results: 500, // Adjust if you have thousands of images
            },
            (error, result) => {
                if (error) {
                    reject(error);
                    return;
                }
                resolve(result.resources.map((r) => r.public_id));
            }
        );
    });
