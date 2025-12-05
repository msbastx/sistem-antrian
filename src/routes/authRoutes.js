// src/routes/authRoutes.js
import { Router } from "express";
import { loginUser, loginAdmin, registerUser } from "../controllers/authController.js";

const router = Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser);
router.post("/admin/login", loginAdmin);

export default router;
