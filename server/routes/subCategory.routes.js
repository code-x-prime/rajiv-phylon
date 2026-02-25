import express from "express";
import * as subCategoryController from "../controllers/subCategory.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { uploadSingle } from "../middlewares/upload.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.get("/", asyncHandler(subCategoryController.getAll)); // public – all subcategories
router.get("/category/:categoryId", asyncHandler(subCategoryController.getByCategory)); // public
router.post("/", verifyAdmin, uploadSingle, asyncHandler(subCategoryController.create));
router.put("/:id", verifyAdmin, uploadSingle, asyncHandler(subCategoryController.update));
router.delete("/:id", verifyAdmin, asyncHandler(subCategoryController.remove));

export default router;
