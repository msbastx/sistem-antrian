// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

// Middleware umum: cek token
export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  // Harus bentuk: "Bearer <token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token tidak ditemukan" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res
      .status(401)
      .json({ success: false, message: "Token tidak valid atau sudah kadaluarsa" });
  }
};

// Middleware khusus user
export const authUser = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.role !== "user") {
      return res
        .status(403)
        .json({ success: false, message: "Akses user saja" });
    }
    next();
  });
};

// Middleware khusus admin
export const authAdmin = (req, res, next) => {
  authMiddleware(req, res, () => {
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ success: false, message: "Akses admin saja" });
    }
    next();
  });
};
