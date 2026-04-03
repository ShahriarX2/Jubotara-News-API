import express from "express";
import { createNews, getNews } from "../controllers/news.controller.js";

const router = express.Router();

router.post("/", createNews);
router.get("/", getNews);

export default router;