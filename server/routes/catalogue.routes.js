import express from "express";
import * as catalogueController from "../controllers/catalogue.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { uploadPdf } from "../middlewares/upload.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

// Public: GET /api/catalogue
router.get("/", asyncHandler(catalogueController.getCatalogue));

// Admin: POST /api/catalogue (upload or replace PDF)
router.post("/", verifyAdmin, uploadPdf, asyncHandler(catalogueController.updateCatalogue));

// Admin: PUT /api/catalogue
router.put("/", verifyAdmin, uploadPdf, asyncHandler(catalogueController.updateCatalogue));

// Admin: DELETE /api/catalogue
router.delete("/", verifyAdmin, asyncHandler(catalogueController.deleteCatalogue));

export default router;
