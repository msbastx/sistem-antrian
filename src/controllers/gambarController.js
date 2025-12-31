import pool from "../config/db.js";

export const deleteGambar = async (req, res) => {
  const { id } = req.params;

  try {
    // 1. cek gambar ada atau tidak
    const [cek] = await pool.query(
      "SELECT id FROM gambar WHERE id = ?",
      [id]
    );

    if (cek.length === 0) {
      return res.status(404).json({
        message: "Gambar tidak ditemukan",
      });
    }

    // 2. mulai transaksi
    await pool.query("START TRANSACTION");

    // 3. hapus relasi dulu
    await pool.query("DELETE FROM `like` WHERE id_gambar = ?", [id]);
    await pool.query("DELETE FROM post WHERE id_gambar = ?", [id]);

    // 4. hapus gambar
    await pool.query("DELETE FROM gambar WHERE id = ?", [id]);

    // 5. commit
    await pool.query("COMMIT");

    res.json({
      message: "Gambar berhasil dihapus",
    });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error deleteGambar:", error);
    res.status(500).json({
      message: "Gagal menghapus gambar",
    });
  }
};
