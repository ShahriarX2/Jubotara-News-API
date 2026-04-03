import express from "express";
import cors from "cors";
import multer from "multer";

import newsRoutes from "./routes/news.routes.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

app.use(cors({
    origin: [
        "https://jubotaranews.com",
        "http://localhost:3000",
    ],
    credentials: true,
}));
app.use(express.json());

app.use("/api/v1/news", newsRoutes);

app.use("/api/v1/auth", authRoutes);

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        res.status(400).json({ error: err.message });
        return;
    }

    next(err);
});

export default app;
