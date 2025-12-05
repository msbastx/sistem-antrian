// src/controllers/authController.js
import db from "../config/db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

const createToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

// POST /api/auth/user/login
// body: { email, password }
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Email dan password wajib diisi" });
  }

  try {
    const [rows] = await db.query(
      "SELECT user_id, nama, email, password FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Email atau password salah" });
    }

    const user = rows[0];

    // Untuk sekarang plain-text compare (sesuai isi DB-mu)
    if (user.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Email atau password salah" });
    }

    const token = createToken({ id: user.user_id, role: "user" });

    res.json({
      success: true,
      message: "Login user berhasil",
      token,
      user: {
        id: user.user_id,
        nama: user.nama,
        email: user.email,
        role: "user",
      },
    });
  } catch (err) {
    console.error("loginUser error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/auth/admin/login
// body: { username, password }
export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Username dan password wajib diisi" });
  }

  try {
    const [rows] = await db.query(
      "SELECT admin_id, nama, username, password FROM admin WHERE username = ? LIMIT 1",
      [username]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Username atau password salah" });
    }

    const admin = rows[0];

    if (admin.password !== password) {
      return res
        .status(401)
        .json({ success: false, message: "Username atau password salah" });
    }

    const token = createToken({ id: admin.admin_id, role: "admin" });

    res.json({
      success: true,
      message: "Login admin berhasil",
      token,
      admin: {
        id: admin.admin_id,
        nama: admin.nama,
        username: admin.username,
        role: "admin",
      },
    });
  } catch (err) {
    console.error("loginAdmin error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/auth/user/register
// body: { nama, email, password }
export const registerUser = async (req, res) => {
  const { nama, email, password } = req.body;

  if (!nama || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Nama, email, dan password wajib diisi",
    });
  }

  try {
    // cek apakah email sudah terpakai
    const [existing] = await db.query(
      "SELECT user_id FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar",
      });
    }

    // INSERT user baru
    const [result] = await db.query(
      "INSERT INTO users (nama, email, password) VALUES (?, ?, ?)",
      [nama, email, password] // NOTE: untuk produksi seharusnya di-hash
    );

    const newUserId = result.insertId;

    // langsung buat token (auto-login setelah register)
    const token = createToken({ id: newUserId, role: "user" });

    res.status(201).json({
      success: true,
      message: "Registrasi user berhasil",
      token,
      user: {
        id: newUserId,
        nama,
        email,
        role: "user",
      },
    });
  } catch (err) {
    console.error("registerUser error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};