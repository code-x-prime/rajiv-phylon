import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminAuthRoutes from "./routes/adminAuth.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import subCategoryRoutes from "./routes/subCategory.routes.js";
import productRoutes from "./routes/product.routes.js";
import galleryRoutes from "./routes/gallery.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import bannerRoutes from "./routes/banner.routes.js";

import {
    errorHandler,
    notFoundHandler,
} from "./middlewares/error.middleware.js";

const app = express();

// Security & Parse Middlewares
app.use(express.json({ limit: '2048mb' }));

app.use(express.urlencoded({ extended: false, limit: '2048mb' }));
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim().replace(/\/$/, ""))
    : ["http://localhost:3000", "http://localhost:5173"];

// Startup pe verify — PM2 logs me dikhega
if (process.env.NODE_ENV === "production") {
    console.log("[CORS] Allowed origins:", allowedOrigins);
}

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow requests with no origin (e.g. Postman, curl)
            if (!origin) return callback(null, true);

            if (process.env.NODE_ENV === "development") return callback(null, true);

            if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);

            // Fallback: allow any origin from our domain (www, admin, non-www)
            try {
                const u = new URL(origin);
                if (u.hostname === "testingkeliye.online" || u.hostname.endsWith(".testingkeliye.online")) {
                    return callback(null, true);
                }
            } catch (_) {}

            callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Pragma",
            "Origin",
            "Accept",
            "X-Requested-With",
        ],
        exposedHeaders: ["Set-Cookie"],
        preflightContinue: false,
        optionsSuccessStatus: 204,
        maxAge: 86400, // 24 hours
    })
);

// Cache Control Headers
app.use((req, res, next) => {
    res.header("Cache-Control", "no-store, no-cache, must-revalidate, private");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    res.header("X-Content-Type-Options", "nosniff");
    res.header("X-Frame-Options", "DENY");
    res.header("X-XSS-Protection", "1; mode=block");
    res.header(
        "Strict-Transport-Security",
        "max-age=31536000; includeSubDomains"
    );
    next();
});

// Static Files
app.use(express.static("public/upload"));




// API Routes
app.use("/api/auth", adminAuthRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/banners", bannerRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});

// Error Handling Middleware
app.use(errorHandler);

// 404 Handler
app.use(notFoundHandler);

export default app;
