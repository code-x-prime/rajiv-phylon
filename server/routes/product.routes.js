import express from "express";
import * as productController from "../controllers/product.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { uploadMultiple } from "../middlewares/upload.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(productController.getAll)); // public for client
router.get("/featured", asyncHandler(productController.getFeatured));
router.get("/new-arrivals", asyncHandler(productController.getNewArrivals));
router.get("/high-demand", asyncHandler(productController.getHighDemand));
router.get("/by-id/:id", verifyAdmin, asyncHandler(productController.getById));
router.get("/feature/:tag", asyncHandler(productController.getByFeature)); // public
router.get("/:slug", asyncHandler(productController.getOne)); // public
router.post("/", verifyAdmin, uploadMultiple(4), asyncHandler(productController.create));
router.put("/:id", verifyAdmin, uploadMultiple(4), asyncHandler(productController.update));
router.delete("/:id", verifyAdmin, asyncHandler(productController.remove));
router.delete("/:id/images/:imageId", verifyAdmin, asyncHandler(productController.removeImage));

export default router;
