// src/controllers/userController.js
import db from "../config/db.js";

// GET /api/users/:userId/antrian
export const getUserAntrian = async (req, res) => {
  const { userId } = req.params;

  try {
    const [resultSets] = await db.query("CALL sp_get_antrian_user(?);", [
      userId,
    ]);
    const data = resultSets[0] || []; // hasil set pertama

    res.json({ success: true, data });
  } catch (err) {
    console.error("Error getUserAntrian:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/users/:userId/notifikasi
export const getUserNotifikasi = async (req, res) => {
  const { userId } = req.params;

  try {
    const [resultSets] = await db.query("CALL sp_get_notifikasi_user(?);", [
      userId,
    ]);
    const data = resultSets[0] || [];

    res.json({ success: true, data });
  } catch (err) {
    console.error("Error getUserNotifikasi:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/users/me/profile (pakai authUser, ambil dari req.user.id)
export const getUserProfile = async (req, res) => {
  const userId = req.user.id; // dari JWT

  try {
    const [rows] = await db.query(
      "SELECT user_id, nama, email, created_at FROM users WHERE user_id = ? LIMIT 1",
      [userId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User tidak ditemukan" });
    }

    res.json({
      success: true,
      data: rows[0],
    });
  } catch (err) {
    console.error("getUserProfile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/users/me/profile
// body boleh berisi: { nama?, email?, password? }
export const updateUserProfile = async (req, res) => {
  const userId = req.user.id;
  const { nama, email, password } = req.body;

  if (!nama && !email && !password) {
    return res.status(400).json({
      success: false,
      message: "Tidak ada data yang diupdate",
    });
  }

  try {
    // kalau email diubah, cek tidak bentrok dengan user lain
    if (email) {
      const [emailCheck] = await db.query(
        "SELECT user_id FROM users WHERE email = ? AND user_id <> ? LIMIT 1",
        [email, userId]
      );
      if (emailCheck.length > 0) {
        return res
          .status(409)
          .json({ success: false, message: "Email sudah digunakan user lain" });
      }
    }

    // bangun query dinamis sederhana
    const fields = [];
    const values = [];

    if (nama) {
      fields.push("nama = ?");
      values.push(nama);
    }
    if (email) {
      fields.push("email = ?");
      values.push(email);
    }
    if (password) {
      fields.push("password = ?");
      values.push(password); // NOTE: seharusnya di-hash untuk produksi
    }

    values.push(userId);

    const sql = `UPDATE users SET ${fields.join(", ")} WHERE user_id = ?`;
    await db.query(sql, values);

    res.json({
      success: true,
      message: "Profil user berhasil diupdate",
    });
  } catch (err) {
    console.error("updateUserProfile error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/users/me/antrian
export const getMyAntrian = async (req, res) => {
  const userId = req.user.id;
  try {
    const [resultSets] = await db.query("CALL sp_get_antrian_user(?);", [
      userId,
    ]);
    const data = resultSets[0] || [];
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error getMyAntrian:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/users/me/notifikasi
export const getMyNotifikasi = async (req, res) => {
  const userId = req.user.id;
  try {
    const [resultSets] = await db.query("CALL sp_get_notifikasi_user(?);", [
      userId,
    ]);
    const data = resultSets[0] || [];
    res.json({ success: true, data });
  } catch (err) {
    console.error("Error getMyNotifikasi:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};