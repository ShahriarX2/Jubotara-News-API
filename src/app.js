import express from "express";
import cors from "cors";
import multer from "multer";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import newsRoutes from "./routes/news.routes.js";
import { resolveSlugById } from "./controllers/news.controller.js";
import frontendRoutes from "./routes/frontend.routes.js";
import authRoutes from "./routes/auth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import teamRoutes from "./routes/team.routes.js";
import videoRoutes from "./routes/video.routes.js";
import navbarRoutes from "./routes/navbar.routes.js";
import logoRoutes from "./routes/logo.routes.js";
import metricsRoutes from "./routes/metrics.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import usersRoutes from "./routes/users.routes.js";
import communicationRoutes from "./routes/communication.routes.js";
import seoRoutes from "./routes/seo.routes.js";

const app = express();

// Trust proxy for rate limiting (needed behind proxies like Render)
app.set("trust proxy", 1);

app.use(cors({
    origin: [
        "https://jubotaranews.com",
        "http://localhost:3000",
    ],
    credentials: true,
}));
app.use(express.json());

const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per windowMs
    message: { error: "Too many requests, please try again later." },
});

const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login attempts per hour
    message: { error: "Too many login attempts, please try again in an hour." },
});

app.use("/api/v1/", generalLimiter);
app.use("/api/v1/auth/login", authLimiter);

app.get("/api/v1/health", (req, res) => {
    const status = {
        success: true,
        message: "API is running",
        timestamp: new Date(),
        uptime: process.uptime(),
        mongoStatus: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    };
    res.json(status);
});

app.get("/api/news/resolve-slug/:id", resolveSlugById);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/frontend", frontendRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/team", teamRoutes);
app.use("/api/v1/video", videoRoutes);
app.use("/api/v1/admin/navbar", navbarRoutes);
app.use("/api/v1/admin/settings", settingsRoutes);
app.use("/api/v1/settings/logo", logoRoutes);
app.use("/api/v1/admin/metrics", metricsRoutes);
app.use("/api/v1/upload", uploadRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/communication", communicationRoutes);
app.use("/", seoRoutes);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({ error: err.message });
        return;
    }

    if (err?.name === "ValidationError") {
        res.status(400).json({ error: err.message });
        return;
    }

    if (err?.name === "CastError") {
        res.status(400).json({ error: "Invalid id or field value" });
        return;
    }

    if (err?.code === 11000) {
        res.status(409).json({ error: "Duplicate value (e.g. slug already exists)" });
        return;
    }

    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
});

export default app;
