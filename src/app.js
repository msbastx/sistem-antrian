// src/app.js
import express from "express";
import cors from "cors";

import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import antrianRoutes from "./routes/antrianRoutes.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/antrian", antrianRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API Sistem Antrian Aktif" });
});

export default app;
