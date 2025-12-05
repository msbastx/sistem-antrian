// src/routes/adminRoutes.js
import { Router } from "express";
import {
  listAntrianLayanan,
  getAntrianAktif,
  panggilBerikut,
} from "../controllers/adminController.js";

const router = Router();

router.get("/layanan/:layananId/antrian", listAntrianLayanan);
router.get("/layanan/:layananId/antrian", authAdmin, listAntrianLayanan);
router.get("/layanan/:layananId/aktif", authAdmin, getAntrianAktif);
router.post("/layanan/:layananId/panggil", authAdmin, panggilBerikut);

router.get("/layanan", authAdmin, listLayanan);
router.post("/layanan", authAdmin, createLayanan);
router.put("/layanan/:id", authAdmin, updateLayanan);
router.delete("/layanan/:id", authAdmin, deleteLayanan);

router.get("/notifikasi", authAdmin, listNotifikasiAdmin);

export default router;
