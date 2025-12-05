// src/middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

const authMiddleware = (req, res, next, expectedRole = null) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res
      .status(401)
      .json({ success: false, message: "Token tidak ditemukan" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Token tidak valid" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };

    if (expectedRole && decoded.role !== expectedRole) {
      return res
        .status(403)
        .json({ success: false, message: "Akses ditolak" });
    }

    next();
  } catch (err) {
    console.error("authMiddleware error:", err);
    return res
      .status(401)
      .json({ success: false, message: "Token tidak valid / kadaluarsa" });
  }
};

export const authUser = (req, res, next) =>
  authMiddleware(req, res, next, "user");

export const authAdmin = (req, res, next) =>
  authMiddleware(req, res, next, "admin");
