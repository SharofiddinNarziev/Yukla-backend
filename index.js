// index.js
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");

// 🔁 Yo‘nalishlar
const driverRoutes = require("./routes/driverRoutes");
const userRoutes = require("./routes/userRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const adminRoutes = require("./routes/adminRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// 🧾 So‘rovlarni log qilib boramiz
app.use((req, res, next) => {
  console.log("📥 So‘rov:", req.method, req.path);
  next();
});

// 🔁 API marshrutlari
app.use("/api/drivers", driverRoutes);
app.use("/api/auth", userRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/settings", settingsRoutes);

// 🔌 Bazaga ulanib, serverni ishga tushiramiz
async function startServer() {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ PostgreSQL bazaga muvaffaqiyatli ulandi");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server ishlayapti: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ PostgreSQLga ulanishda xatolik:", error.message);
  }
}

startServer();
