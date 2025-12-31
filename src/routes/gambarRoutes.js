import express from "express";
import { deleteGambar } from "../controllers/gambarController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// DELETE gambar
router.delete("/:id", authMiddleware, deleteGambar);

export default router;
