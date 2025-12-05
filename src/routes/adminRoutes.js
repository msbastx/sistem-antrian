// src/routes/adminRoutes.js
import { Router } from "express";
import {
  listAntrianLayanan,
  getAntrianAktif,
  panggilBerikut,
  listLayanan,
  createLayanan,
  updateLayanan,
  deleteLayanan,
  listNotifikasiAdmin,
  resetAntrianHarian,
  listAuditLog,
} from "../controllers/adminController.js";
import { authAdmin } from "../middleware/authMiddleware.js";

const router = Router();

// Layanan
router.get("/layanan", authAdmin, listLayanan);
router.post("/layanan", authAdmin, createLayanan);
router.put("/layanan/:id", authAdmin, updateLayanan);
router.delete("/layanan/:id", authAdmin, deleteLayanan);

// Antrian per layanan
router.get("/layanan/:layananId/antrian", authAdmin, listAntrianLayanan);
router.get("/layanan/:layananId/aktif", authAdmin, getAntrianAktif);
router.post("/layanan/:layananId/panggil", authAdmin, panggilBerikut);

// Reset antrian harian
router.post("/antrian/reset-harian", authAdmin, resetAntrianHarian);

// Notifikasi
router.get("/notifikasi", authAdmin, listNotifikasiAdmin);

// Audit log
router.get("/audit-log", authAdmin, listAuditLog);

export default router;
