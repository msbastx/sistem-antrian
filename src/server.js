import dotenv from "dotenv";
import app from "./app.js";
import gambarRoutes from "./routes/gambarRoutes.js";
dotenv.config();

const PORT = process.env.PORT;

app.use("/api/gambar", gambarRoutes);
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
