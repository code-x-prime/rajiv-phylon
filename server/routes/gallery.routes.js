import express from "express";
import * as galleryController from "../controllers/gallery.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { uploadGallery } from "../middlewares/upload.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(galleryController.getAll)); // public for client
router.use(verifyAdmin);
router.post("/", uploadGallery, asyncHandler(galleryController.upload));
router.delete("/:id", asyncHandler(galleryController.remove));

export default router;
