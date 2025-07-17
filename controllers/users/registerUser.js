const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async function registerUser(req, res) {
  const { full_name, phone, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (full_name, phone, email, password)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [full_name, phone, email, hashedPassword]
    );

    const user = result.rows[0];

    const token = jwt.sign(
      { id: user.id, role: user.role || "client" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(201).json({
      message: "Foydalanuvchi ro'yxatdan o'tdi",
      token,
      full_name: user.full_name
    });

  } catch (error) {
    console.error("Ro'yxatdan o'tishda xatolik:", error);
    res.status(500).json({ error: "Ro'yxatdan o‘tib bo‘lmadi" });
  }
};
