import Subscriber from "../models/subscriber.model.js";
import Contact from "../models/contact.model.js";
import asyncHandler from "../utils/async-handler.js";

export const subscribeNewsletter = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    const existingSubscriber = await Subscriber.findOne({ email });
    if (existingSubscriber) {
        if (existingSubscriber.isActive) {
            return res.status(400).json({ success: false, message: "Already subscribed" });
        } else {
            existingSubscriber.isActive = true;
            await existingSubscriber.save();
            return res.json({ success: true, message: "Subscription reactivated" });
        }
    }

    await Subscriber.create({ email });
    res.status(201).json({ success: true, message: "Subscribed successfully" });
});

export const submitContactForm = asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: "Name, email and message are required" });
    }

    await Contact.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: "Message sent successfully" });
});

export const getSubscribers = asyncHandler(async (req, res) => {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.json({ success: true, data: subscribers });
});

export const getContactMessages = asyncHandler(async (req, res) => {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
});
