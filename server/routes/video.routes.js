import { Router } from "express";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { uploadVideo } from "../middlewares/upload.middleware.js";
import * as videoController from "../controllers/video.controller.js";

const router = Router();

// Public
router.get("/", videoController.getPublic);

// Admin
router.get("/all", verifyAdmin, videoController.getAll);
router.post("/", verifyAdmin, uploadVideo, videoController.create);
router.put("/:id", verifyAdmin, uploadVideo, videoController.update);
router.patch("/reorder", verifyAdmin, videoController.reorder);
router.patch("/:id/toggle-active", verifyAdmin, videoController.toggleActive);
router.delete("/:id", verifyAdmin, videoController.remove);

export default router;
