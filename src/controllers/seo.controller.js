import News from "../models/news.model.js";
import Category from "../models/category.model.js";
import asyncHandler from "../utils/async-handler.js";

export const getSitemap = asyncHandler(async (req, res) => {
    const baseUrl = process.env.FRONTEND_URL || "https://jubotaranews.com";

    const [news, categories] = await Promise.all([
        News.find({ status: "published" }).select("slug updatedAt").sort({ updatedAt: -1 }),
        Category.find().select("slug"),
    ]);

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>${baseUrl}</loc>
        <changefreq>always</changefreq>
        <priority>1.0</priority>
    </url>`;

    // Add categories
    categories.forEach(cat => {
        xml += `
    <url>
        <loc>${baseUrl}/category/${cat.slug}</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
    </url>`;
    });

    // Add news
    news.forEach(item => {
        xml += `
    <url>
        <loc>${baseUrl}/news/${item.slug}</loc>
        <lastmod>${item.updatedAt.toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
    </url>`;
    });

    xml += `
</urlset>`;

    res.header("Content-Type", "application/xml");
    res.send(xml);
});

export const getRssFeed = asyncHandler(async (req, res) => {
    const baseUrl = process.env.FRONTEND_URL || "https://jubotaranews.com";
    const news = await News.find({ status: "published" })
        .sort({ publishedAt: -1 })
        .limit(20);

    let rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0">
<channel>
  <title>Jubotara News</title>
  <link>${baseUrl}</link>
  <description>Latest news from Jubotara Portal</description>`;

    news.forEach(item => {
        rss += `
  <item>
    <title><![CDATA[${item.headline}]]></title>
    <link>${baseUrl}/news/${item.slug}</link>
    <description><![CDATA[${item.content.substring(0, 200)}...]]></description>
    <pubDate>${item.publishedAt.toUTCString()}</pubDate>
    <guid>${baseUrl}/news/${item.slug}</guid>
  </item>`;
    });

    rss += `
</channel>
</rss>`;

    res.header("Content-Type", "application/xml");
    res.send(rss);
});
