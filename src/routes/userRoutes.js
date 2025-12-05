// src/routes/userRoutes.js
import { Router } from "express";
import {
  getUserAntrian,
  getUserNotifikasi,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { authUser } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * PROFILE
 */
router.get("/me/profile", authUser, (req, res) => {
  return getUserProfile(req, res);
});

router.put("/me/profile", authUser, (req, res) => {
  return updateUserProfile(req, res);
});

/**
 * ANTRIAN & NOTIFIKASI USER
 * Sekarang juga pakai authUser dan otomatis ambil id dari token
 */
router.get("/me/antrian", authUser, (req, res) => {
  req.params.userId = req.user.id;
  return getUserAntrian(req, res);
});

router.get("/me/notifikasi", authUser, (req, res) => {
  req.params.userId = req.user.id;
  return getUserNotifikasi(req, res);
});

export default router;
