// src/controllers/adminController.js
import db from "../config/db.js";

/**
 * GET /api/admin/layanan/:layananId/antrian
 */
export const listAntrianLayanan = async (req, res) => {
  const { layananId } = req.params;

  try {
    const [resultSets] = await db.query("CALL sp_list_antrian_layanan(?);", [
      layananId,
    ]);
    const data = resultSets[0] || [];

    res.json({ success: true, data });
  } catch (err) {
    console.error("Error listAntrianLayanan:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * GET /api/admin/layanan/:layananId/aktif
 */
export const getAntrianAktif = async (req, res) => {
  const { layananId } = req.params;

  try {
    const [resultSets] = await db.query("CALL sp_get_antrian_aktif(?);", [
      layananId,
    ]);
    const rows = resultSets[0] || [];
    const data = rows[0] || null;

    res.json({ success: true, data });
  } catch (err) {
    console.error("Error getAntrianAktif:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * POST /api/admin/layanan/:layananId/panggil
 * auth: admin
 */
export const panggilBerikut = async (req, res) => {
  const { layananId } = req.params;
  const adminId = req.user.id; // dari token

  try {
    const [resultSets] = await db.query("CALL sp_panggil_berikut(?, ?);", [
      adminId,
      layananId,
    ]);

    const rows = resultSets[0] || [];
    const data = rows[0] || null;

    res.json({
      success: true,
      data,
      message: data
        ? "Berhasil memanggil antrian berikutnya"
        : "Tidak ada antrian MENUNGGU",
    });
  } catch (err) {
    console.error("Error panggilBerikut:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ==========================
 * CRUD LAYANAN (opsional tapi bagus)
 * ========================== */

// GET /api/admin/layanan
export const listLayanan = async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT layanan_id, nama_layanan, rata_waktu_layanan, created_at FROM layanan ORDER BY layanan_id"
    );
    res.json({ success: true, data: rows });
  } catch (err) {
    console.error("Error listLayanan:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/admin/layanan
export const createLayanan = async (req, res) => {
  const { nama_layanan, rata_waktu_layanan } = req.body;

  if (!nama_layanan) {
    return res
      .status(400)
      .json({ success: false, message: "nama_layanan wajib diisi" });
  }

  try {
    await db.query("CALL sp_create_layanan(?, ?);", [
      nama_layanan,
      rata_waktu_layanan || 10,
    ]);

    res
      .status(201)
      .json({ success: true, message: "Layanan berhasil dibuat" });
  } catch (err) {
    console.error("Error createLayanan:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/admin/layanan/:id
export const updateLayanan = async (req, res) => {
  const { id } = req.params;
  const { nama_layanan, rata_waktu_layanan } = req.body;

  if (!nama_layanan && !rata_waktu_layanan) {
    return res.status(400).json({
      success: false,
      message: "Tidak ada data yang diupdate",
    });
  }

  try {
    await db.query("CALL sp_update_layanan(?, ?, ?);", [
      id,
      nama_layanan || "",
      rata_waktu_layanan || 10,
    ]);

    res.json({ success: true, message: "Layanan berhasil diperbarui" });
  } catch (err) {
    console.error("Error updateLayanan:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /api/admin/layanan/:id
export const deleteLayanan = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query("CALL sp_delete_layanan(?);", [id]);
    res.json({ success: true, message: "Layanan berhasil dihapus" });
  } catch (err) {
    console.error("Error deleteLayanan:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ==========================
 * NOTIFIKASI SISTEM (admin)
 * ========================== */

// GET /api/admin/notifikasi
export const listNotifikasiAdmin = async (req, res) => {
  try {
    const [resultSets] = await db.query("CALL sp_list_notifikasi_admin();");
    const data = resultSets[0] || [];
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error listNotifikasiAdmin:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
