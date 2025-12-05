// src/routes/userRoutes.js
import { Router } from "express";
import {
  getUserAntrian,
  getUserNotifikasi,
  getUserProfile,
  updateUserProfile,
  getUserEstimasiAktif,
  listLayananUser,
  getAntrianAktifUser,
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

// Estimasi antrian aktif user
router.get("/me/estimasi", authUser, (req, res) => {
  return getUserEstimasiAktif(req, res);
});

// Layanan aktif

router.get("/layanan", authUser, (req, res) => {
  return listLayananUser(req, res);
});

router.get("/layanan/:layananId/aktif", authUser, (req, res) => {
  return getAntrianAktifUser(req, res);
});

export default router;
