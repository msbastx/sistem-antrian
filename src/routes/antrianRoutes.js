// src/routes/antrianRoutes.js
import { Router } from "express";
import { ambilAntrian, selesaiAntrian } from "../controllers/antrianController.js";

const router = Router();

router.post("/antrian", authUser, ambilAntrian);
router.post("/antrian/:antrianId/selesai", authAdmin, selesaiAntrian);
router.post("/antrian/:antrianId/batalkan", authUser, batalkanAntrian);

export default router;
