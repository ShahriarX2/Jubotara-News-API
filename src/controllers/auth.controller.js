import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const sanitizeUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isActivated: user.isActivated,
});

// Register (only first time or manual use)
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const normalizedEmail = email?.trim().toLowerCase();
        const exist = await User.findOne({ email: normalizedEmail });
        if (exist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
        });

        res.status(201).json({ success: true, user: sanitizeUser(user) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const normalizedEmail = email?.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: sanitizeUser(user),
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const me = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ user: sanitizeUser(user) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
