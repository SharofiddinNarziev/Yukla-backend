console.log("🔍 DB_HOST:", process.env.DB_HOST);
// ✅ .env faylni birinchi yuklaymiz
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const driverRoutes = require("./routes/driverRoutes");
const userRoutes = require("./routes/userRoutes");
const ordersRoutes = require("./routes/ordersRoutes");
const adminRoutes = require("./routes/adminRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const pool = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// 🔁 So‘rovni log qilish
app.use((req, res, next) => {
  console.log("🔎 Kelgan so‘rov yo‘li:", req.method, req.path);
  next();
});

// 🔁 Asosiy ishlar
async function startServer() {
  try {
    await pool.query();
    console.log("✅ PostgreSQL ma'lumotlar bazasiga ulandik");

    // 📌 API yo‘nalishlari
    app.use("/api/drivers", driverRoutes);
    app.use("/api/auth", userRoutes);
    app.use("/api/orders", ordersRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/settings", settingsRoutes);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server ishga tushdi: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Bazaga ulanishda xatolik:", error.message);
  }
}

startServer();
