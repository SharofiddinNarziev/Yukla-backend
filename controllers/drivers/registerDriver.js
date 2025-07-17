const pool = require("../../config/db");
const bcrypt = require("bcrypt");

module.exports = async function registerDriver(req, res) {
  const {
    full_name,
    phone,
    email,
    password,
    vehicle_type,
    vehicle_number,
    vehicle_capacity,
    vehicle_model,
    license_number,
    license_expiry,
  } = req.body;

  // 🔒 Majburiy maydonlar validatsiyasi
  if (!full_name || !phone || !password) {
    return res.status(400).json({ error: "Ism, telefon va parol majburiy." });
  }

  try {
    const existing = await pool.query(
      "SELECT id FROM drivers WHERE phone = $1 OR email = $2",
      [phone, email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Bu haydovchi allaqachon mavjud" });
    }

    const hashedPassword = await bcrypt.hash(password.toString(), 10);

    const result = await pool.query(
      `INSERT INTO drivers (
        full_name, phone, email, password,
        vehicle_type, vehicle_number, vehicle_capacity, 
        vehicle_model, license_number, license_expiry
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING id, full_name, phone, email`,
      [
        full_name,
        phone,
        email,
        hashedPassword,
        vehicle_type,
        vehicle_number,
        vehicle_capacity ? parseFloat(vehicle_capacity) : null,
        vehicle_model,
        license_number,
        license_expiry || null
      ]
    );

    res.status(201).json({
      message: "Haydovchi ro'yxatdan o'tdi",
      driver: result.rows[0],
    });
  } catch (error) {
    console.error("🚨 Xatolik:", error);
    res.status(500).json({ error: "Server xatosi yuz berdi" });
  }
};
