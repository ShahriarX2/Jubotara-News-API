import { PutObjectCommand, DeleteObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import r2Client from "../../config/r2.js";
import crypto from "crypto";

export const uploadToR2 = async (buffer, options = {}) => {
    const fileExtension = options.extension || ".jpg";
    const fileName = `${crypto.randomBytes(16).toString("hex")}${fileExtension}`;
    const key = `uploads/${fileName}`;

    const command = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
        Body: buffer,
        ContentType: options.mimetype || "image/jpeg",
    });

    try {
        console.log(`[R2] Attempting upload to bucket: ${process.env.R2_BUCKET_NAME}, key: ${key}`);
        await r2Client.send(command);
        console.log(`[R2 Success] File uploaded successfully: ${key}`);
    } catch (error) {
        console.error(`[R2 Error] Failed to upload ${key} to bucket ${process.env.R2_BUCKET_NAME}`);
        console.error(`[R2 Error Details]`, {
            code: error.Code,
            message: error.message,
            requestId: error.$metadata?.requestId,
            endpoint: process.env.R2_ENDPOINT,
        });
        throw error;
    }

    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;

    return {
        secure_url: publicUrl,
        public_id: key,
        provider: "r2",
    };
};

export const deleteFromR2 = async (key) => {
    const command = new DeleteObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME,
        Key: key,
    });

    try {
        await r2Client.send(command);
        console.log(`[R2 Success] File deleted successfully: ${key}`);
    } catch (error) {
        console.error(`[R2 Error] Failed to delete ${key} from bucket ${process.env.R2_BUCKET_NAME}`);
        throw error;
    }
};

export const listR2Objects = async (prefix = "uploads/") => {
    console.log(`[R2] Listing objects with prefix: "${prefix}" in bucket: ${process.env.R2_BUCKET_NAME}`);
    const command = new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME,
        Prefix: prefix,
    });

    try {
        const response = await r2Client.send(command);
        console.log(`[R2] Found ${response.Contents?.length || 0} objects`);
        return response.Contents?.map((item) => item.Key) || [];
    } catch (error) {
        console.error(`[R2 Error] Failed to list objects in bucket ${process.env.R2_BUCKET_NAME}`);
        throw error;
    }
};
