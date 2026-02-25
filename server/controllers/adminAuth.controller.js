import { ApiError } from "../utils/ApiError.js";
import { ApiResponsive } from "../utils/ApiResponsive.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validatePassword } from "../helper/validatePassword.js";

const ACCESS_SECRET = process.env.ACCESS_JWT_SECRET || process.env.JWT_SECRET || "admin-access-secret";
const ACCESS_EXPIRY = process.env.ACCESS_TOKEN_LIFE || "7d";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

/**
 * Register admin (Postman / internal use only – no public route)
 */
export const register = asyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    validatePassword(password);

    const existing = await prisma.admin.findUnique({ where: { email } });
    if (existing) {
        throw new ApiError(409, "Admin with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
        data: {
            email,
            password: hashedPassword,
            name: name || null,
        },
    });

    const { password: _, ...rest } = admin;
    res.status(201).json(new ApiResponsive(201, { admin: rest }, "Admin registered successfully"));
});

/**
 * Login – returns access token (and optional cookie)
 */
export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
        throw new ApiError(401, "Invalid email or password");
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
        throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = jwt.sign(
        { id: admin.id, email: admin.email },
        ACCESS_SECRET,
        { expiresIn: ACCESS_EXPIRY }
    );

    res.cookie("adminToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        maxAge: COOKIE_MAX_AGE * 1000,
        path: "/",
    });

    const { password: _, ...adminWithoutPassword } = admin;
    res.status(200).json(
        new ApiResponsive(
            200,
            { admin: adminWithoutPassword },
            "Logged in successfully"
        )
    );
});

/**
 * Get current admin from HTTP-only cookie (for auth context)
 */
export const me = asyncHandler(async (req, res) => {
    const admin = req.user;
    if (!admin) {
        throw new ApiError(401, "Not authenticated");
    }
    const { password: _, ...rest } = admin;
    res.status(200).json(new ApiResponsive(200, { admin: rest }, "Success"));
});

/**
 * Logout – clear cookie
 */
export const logout = asyncHandler(async (req, res) => {
    res.clearCookie("adminToken", {
        httpOnly: true,
        path: "/",
    });
    res.status(200).json(new ApiResponsive(200, null, "Logged out"));
});
