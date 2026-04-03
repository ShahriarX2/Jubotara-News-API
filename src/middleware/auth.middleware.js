import jwt from "jsonwebtoken";

const adminRoles = new Set(["admin", "administrator"]);
const writerRoles = new Set(["admin", "administrator", "user", "author", "reporter"]);

const getTokenFromRequest = (req) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return null;
    }

    return authHeader.split(" ")[1];
};

export const authMiddleware = (req, res, next) => {
    try {
        const token = getTokenFromRequest(req);

        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};

export const requireAdmin = (req, res, next) => {
    if (!req.user || !adminRoles.has(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
    }

    next();
};

export const requireWriter = (req, res, next) => {
    if (!req.user || !writerRoles.has(req.user.role)) {
        return res.status(403).json({ message: "Forbidden" });
    }

    next();
};

export const isAdminRole = (role) => adminRoles.has(role);

export default authMiddleware;
