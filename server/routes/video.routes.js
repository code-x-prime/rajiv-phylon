import { Router } from "express";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { uploadVideo } from "../middlewares/upload.middleware.js";
import * as videoController from "../controllers/video.controller.js";

const router = Router();

// Full-Screen Single Video (Max 1.5GB) Routes
router.get("/fullscreen", videoController.getFullScreenPublic);
router.get("/fullscreen/admin", verifyAdmin, videoController.getFullScreenAdmin);
router.post("/fullscreen", verifyAdmin, uploadVideo, videoController.saveFullScreenVideo);
router.patch("/fullscreen/toggle-active", verifyAdmin, videoController.toggleFullScreenActive);
router.delete("/fullscreen", verifyAdmin, videoController.removeFullScreenVideo);

// Carousel Videos Routes
router.get("/", videoController.getPublic);

// Admin Carousel Videos
router.get("/all", verifyAdmin, videoController.getAll);
router.post("/", verifyAdmin, uploadVideo, videoController.create);
router.put("/:id", verifyAdmin, uploadVideo, videoController.update);
router.patch("/reorder", verifyAdmin, videoController.reorder);
router.patch("/:id/toggle-active", verifyAdmin, videoController.toggleActive);
router.delete("/:id", verifyAdmin, videoController.remove);

export default router;
