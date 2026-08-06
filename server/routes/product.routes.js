import express from "express";
import * as productController from "../controllers/product.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { uploadMultiple, uploadAnyImage } from "../middlewares/upload.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadFile, getPublicUrl } from "../service/r2Service.js";

const router = express.Router();

router.get("/", asyncHandler(productController.getAll)); // public for client
router.get("/featured", asyncHandler(productController.getFeatured));
router.get("/new-arrivals", asyncHandler(productController.getNewArrivals));
router.get("/high-demand", asyncHandler(productController.getHighDemand));
router.get("/by-id/:id", verifyAdmin, asyncHandler(productController.getById));
router.get("/feature/:tag", asyncHandler(productController.getByFeature)); // public
router.get("/:slug", asyncHandler(productController.getOne)); // public
router.post("/", verifyAdmin, uploadMultiple(4), asyncHandler(productController.create));
router.post("/bulk-assign-categories", verifyAdmin, asyncHandler(productController.bulkAssignCategories));
router.post("/upload-description-image", verifyAdmin, (req, res, next) => {
    uploadAnyImage(req, res, async (err) => {
        if (err) return next(err);
        const file = req.file || (req.files && req.files[0]);
        if (!file) return res.status(400).json({ success: false, message: "No image provided" });
        try {
            const url = await uploadFile(file, "products/descriptions");
            const resolvedUrl = url.startsWith("http") ? url : (getPublicUrl(url) || url);
            // Ensure https protocol
            const secureUrl = resolvedUrl.replace(/^http:\/\//i, "https://");
            res.json({
                success: true,
                url: secureUrl,
                files: [secureUrl],
                isImages: [true],
                messages: ["Image uploaded successfully"],
                base64: null,
            });
        } catch (e) {
            next(e);
        }
    });
});
router.put("/:id", verifyAdmin, uploadMultiple(4), asyncHandler(productController.update));
router.delete("/:id", verifyAdmin, asyncHandler(productController.remove));
router.delete("/:id/images/:imageId", verifyAdmin, asyncHandler(productController.removeImage));

export default router;
