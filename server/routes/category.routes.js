import express from "express";
import * as categoryController from "../controllers/category.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(categoryController.getAll)); // public for client
router.get("/with-subcategories", asyncHandler(categoryController.getAllWithSubcategories));
router.get("/home", asyncHandler(categoryController.getHome));
router.post("/", verifyAdmin, uploadSingle, asyncHandler(categoryController.create));
router.put("/:id", verifyAdmin, uploadSingle, asyncHandler(categoryController.update));
router.delete("/:id", verifyAdmin, asyncHandler(categoryController.remove));

export default router;
