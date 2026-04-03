import express from "express";
import cors from "cors";

import newsRoutes from "./routes/news.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v1/news", newsRoutes);

export default app;