import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import { prisma } from "../config/db.js";

/**
 * Verify JWT and attach admin to req.user (admin-only auth)
 */
export const verifyAdmin = async (req, res, next) => {
    try {
        const token =
            req.cookies?.adminToken ||
            req.cookies?.accessToken ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new ApiError(401, "Unauthorized – login required");
        }

        const decoded = jwt.verify(token, process.env.ACCESS_JWT_SECRET || process.env.JWT_SECRET);
        const admin = await prisma.admin.findUnique({
            where: { id: decoded.id },
        });

        if (!admin) {
            throw new ApiError(401, "Invalid or expired token");
        }

        req.user = admin;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            return next(new ApiError(401, "Invalid or expired token"));
        }
        next(error);
    }
};

export default { verifyAdmin };
