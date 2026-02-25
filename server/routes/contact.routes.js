import express from "express";
import { createInquiry, getInquiries, updateInquiry, deleteInquiry } from "../controllers/contact.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/inquiry", asyncHandler(createInquiry));

router.get("/inquiries", verifyAdmin, asyncHandler(getInquiries));
router.patch("/inquiries/:id", verifyAdmin, asyncHandler(updateInquiry));
router.delete("/inquiries/:id", verifyAdmin, asyncHandler(deleteInquiry));

export default router;
