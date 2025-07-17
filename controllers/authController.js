const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 📌 JWT maxfiy kalit
const JWT_SECRET = process.env.JWT_SECRET || "dude_super_secret";

// ==================== MIJOZ (FOYDALANUVCHI) ====================

const clientRegister = async (req, res) => {
  try {
    const { full_name, phone, email, password } = req.body;

    if (!full_name || !phone || !email || !password) {
      return res.status(400).json({ error: "Barcha maydonlarni to‘ldiring." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await pool.query("SELECT id FROM users WHERE phone = $1 OR email = $2", [phone, email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Email yoki telefon mavjud." });
    }

    const result = await pool.query(
      `INSERT INTO users (full_name, phone, email, password, role)
       VALUES ($1, $2, $3, $4, 'client')
       RETURNING id, full_name, phone, email, role`,
      [full_name, phone, email, hashedPassword]
    );

    res.status(201).json({ message: "Mijoz ro‘yxatdan o‘tdi", user: result.rows[0] });
  } catch (err) {
    console.error("❌ clientRegister xato:", err.message);
    res.status(500).json({ error: "Server xatoligi" });
  }
};

const clientLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRes = await pool.query("SELECT * FROM users WHERE email = $1 AND role = 'client'", [email]);
    const user = userRes.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Email yoki parol noto‘g‘ri" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Mijoz tizimga kirdi", token, user: {
      id: user.id, full_name: user.full_name, email: user.email, role: user.role
    }});
  } catch (err) {
    console.error("❌ clientLogin xato:", err.message);
    res.status(500).json({ error: "Server xatoligi" });
  }
};

// ==================== HAYDOVCHI ====================

const driverRegister = async (req, res) => {
  try {
    const {
      full_name, phone, email, password,
      vehicle_type, vehicle_number, vehicle_capacity,
      vehicle_model, license_number, license_expiry
    } = req.body;

    if (!full_name || !phone || !password || !vehicle_number) {
      return res.status(400).json({ error: "Majburiy maydonlar to‘ldirilmagan." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existing = await pool.query("SELECT id FROM drivers WHERE phone = $1 OR email = $2", [phone, email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Haydovchi mavjud." });
    }

    const result = await pool.query(
      `INSERT INTO drivers (
        full_name, phone, email, password,
        vehicle_type, vehicle_number, vehicle_capacity,
        vehicle_model, license_number, license_expiry
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id, full_name, phone, email`,
      [
        full_name, phone, email, hashedPassword,
        vehicle_type, vehicle_number, vehicle_capacity,
        vehicle_model, license_number, license_expiry
      ]
    );

    res.status(201).json({ message: "Haydovchi ro‘yxatdan o‘tdi", driver: result.rows[0] });
  } catch (err) {
    console.error("❌ driverRegister xato:", err.message);
    res.status(500).json({ error: "Server xatoligi" });
  }
};

const driverLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const driverRes = await pool.query("SELECT * FROM drivers WHERE email = $1", [email]);
    const driver = driverRes.rows[0];

    if (!driver || !(await bcrypt.compare(password, driver.password))) {
      return res.status(400).json({ error: "Email yoki parol noto‘g‘ri" });
    }

    const token = jwt.sign({ id: driver.id, role: "driver" }, JWT_SECRET, { expiresIn: "7d" });

    res.json({ message: "Haydovchi tizimga kirdi", token, driver: {
      id: driver.id, full_name: driver.full_name, email: driver.email
    }});
  } catch (err) {
    console.error("❌ driverLogin xato:", err.message);
    res.status(500).json({ error: "Server xatoligi" });
  }
};

module.exports = {
  clientRegister,
  clientLogin,
  driverRegister,
  driverLogin
};
