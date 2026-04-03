import express from "express";
import cors from "cors";
import multer from "multer";

import newsRoutes from "./routes/news.routes.js";
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

const app = express();

app.use(cors({
    origin: [
        "https://jubotaranews.com",
        "http://localhost:3000",
    ],
    credentials: true,
}));
app.use(express.json());

app.get("/api/v1/health", (req, res) => {
    res.json({ success: true, message: "API is running" });
});

app.use("/api/v1/news", newsRoutes);
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

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({ error: err.message });
        return;
    }

    if (err?.name === "ValidationError") {
        res.status(400).json({ error: err.message });
        return;
    }

    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
});

export default app;
