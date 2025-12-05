// src/routes/antrianRoutes.js
import { Router } from "express";
import {
  ambilAntrian,
  selesaiAntrian,
  batalkanAntrian,
} from "../controllers/antrianController.js";
import { authUser, authAdmin } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * POST /api/antrian
 * User ambil nomor antrian baru
 * body: { layanan_id }
 */
router.post("/", authUser, ambilAntrian);

/**
 * POST /api/antrian/:antrianId/selesai
 * Admin menandai antrian selesai
 */
router.post("/:antrianId/selesai", authAdmin, selesaiAntrian);

/**
 * POST /api/antrian/:antrianId/batalkan
 * User membatalkan antrian miliknya (kalau masih MENUNGGU)
 */
router.post("/:antrianId/batalkan", authUser, batalkanAntrian);

export default router;
