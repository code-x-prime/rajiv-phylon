import express from "express";
import * as bannerController from "../controllers/banner.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { uploadBanner } from "../middlewares/upload.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// Public: GET /banners?position=HOME_DESKTOP&isActive=true
router.get("/", asyncHandler(bannerController.getPublic));
router.get("/all", verifyAdmin, asyncHandler(bannerController.getAll));
router.post("/", verifyAdmin, uploadBanner, asyncHandler(bannerController.create));
router.put("/:id", verifyAdmin, uploadBanner, asyncHandler(bannerController.update));
router.patch("/reorder", verifyAdmin, asyncHandler(bannerController.reorder));
router.patch("/:id/toggle-active", verifyAdmin, asyncHandler(bannerController.toggleActive));
router.delete("/:id", verifyAdmin, asyncHandler(bannerController.remove));

export default router;
