import { Router } from "express";
import {
    subscribeNewsletter,
    submitContactForm,
    getSubscribers,
    getContactMessages,
} from "../controllers/communication.controller.js";
import authMiddleware, { requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

// Public routes
router.post("/newsletter/subscribe", subscribeNewsletter);
router.post("/contact", submitContactForm);

// Admin routes
router.get("/newsletter/subscribers", authMiddleware, requireAdmin, getSubscribers);
router.get("/contact/messages", authMiddleware, requireAdmin, getContactMessages);

export default router;
