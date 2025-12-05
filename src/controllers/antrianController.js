// src/controllers/antrianController.js
import db from "../config/db.js";

/**
 * POST /api/antrian
 * body: { layanan_id }
 * auth: user (req.user.id)
 */
export const ambilAntrian = async (req, res) => {
  const userId = req.user.id; // dari JWT
  const { layanan_id } = req.body;

  if (!layanan_id) {
    return res
      .status(400)
      .json({ success: false, message: "layanan_id wajib diisi" });
  }

  try {
    const [resultSets] = await db.query("CALL sp_ambil_antrian(?, ?);", [
      userId,
      layanan_id,
    ]);

    // sp_ambil_antrian versi final kita SELECT detail antrian di akhir.
    const rows = resultSets[0] || [];
    const data = rows[0] || null;

    res.json({
      success: true,
      message: "Berhasil mengambil nomor antrian",
      data,
    });
  } catch (err) {
    console.error("Error ambilAntrian:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * POST /api/antrian/:antrianId/selesai
 * auth: admin
 */
export const selesaiAntrian = async (req, res) => {
  const { antrianId } = req.params;
  const adminId = req.user.id; // admin dari JWT

  try {
    const [resultSets] = await db.query("CALL sp_selesai_antrian(?, ?);", [
      antrianId,
      adminId,
    ]);

    const rows = resultSets[0] || [];
    const data = rows[0] || null;

    res.json({
      success: true,
      message: `Antrian ${antrianId} diset selesai`,
      data,
    });
  } catch (err) {
    console.error("Error selesaiAntrian:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/antrian/:antrianId/batalkan
export const batalkanAntrian = async (req, res) => {
  const { antrianId } = req.params;
  const userId = req.user.id; // dari JWT (authUser)

  try {
    const [resultSets] = await db.query("CALL sp_batalkan_antrian(?, ?);", [
      antrianId,
      userId,
    ]);

    const rows = resultSets[0] || [];

    // Kalau SP mengembalikan kode error
    if (rows[0] && rows[0].kode === "TIDAK_BISA_DIBATALKAN") {
      return res.status(400).json({
        success: false,
        message: "Antrian tidak bisa dibatalkan (bukan milik Anda / sudah diproses)",
      });
    }

    res.json({
      success: true,
      message: "Antrian berhasil dibatalkan",
      data: rows[0] || null,
    });
  } catch (err) {
    console.error("Error batalkanAntrian:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};