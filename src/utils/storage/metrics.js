import cloudinary from "../../config/cloudinary.js";

/**
 * Get Cloudinary monthly usage statistics
 */
export const getCloudinaryUsage = async () => {
    try {
        const result = await cloudinary.api.usage();
        return {
            storage: {
                used: result.storage.used,
                limit: result.storage.limit,
                used_percent: result.storage.used_percent,
            },
            bandwidth: {
                used: result.bandwidth.used,
                limit: result.bandwidth.limit,
                used_percent: result.bandwidth.used_percent,
            },
            transformations: {
                used: result.transformations.used,
                limit: result.transformations.limit,
                used_percent: result.transformations.used_percent,
            },
            credits: {
                used: result.credits.used,
                limit: result.credits.limit,
                used_percent: result.credits.used_percent,
            }
        };
    } catch (error) {
        console.error("[Metrics] Error fetching Cloudinary usage:", error.message);
        return null;
    }
};

/**
 * Get Cloudflare R2 monthly usage statistics
 * Note: Requires CLOUDFLARE_API_TOKEN with R2 Read permissions
 */
export const getR2Usage = async () => {
    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
    const apiToken = process.env.CLOUDFLARE_API_TOKEN;
    const bucketName = process.env.R2_BUCKET_NAME || "jubotara-news";

    if (!accountId || !apiToken) {
        return null;
    }

    try {
        // Correct Cloudflare R2 Bucket Usage endpoint
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/${accountId}/r2/buckets/${bucketName}/usage`,
            {
                headers: {
                    Authorization: `Bearer ${apiToken}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return { 
                error: true, 
                message: data.errors?.[0]?.message || "R2 API Error",
                details: data
            };
        }

        return data.result;
    } catch (error) {
        console.error("[Metrics] Error fetching R2 usage:", error.message);
        return { error: true, message: error.message };
    }
};
