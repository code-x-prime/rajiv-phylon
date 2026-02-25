import express from "express";
import { register, login, me, logout } from "../controllers/adminAuth.controller.js";
import { verifyAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", verifyAdmin, me);
router.post("/logout", verifyAdmin, logout);

export default router;
