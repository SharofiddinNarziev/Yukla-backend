// controllers/driver/loginDriver.js
const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async function loginDriver(req, res) {
  const { phone, password } = req.body;

  try {
    // Haydovchini topamiz
    const result = await pool.query(
      `SELECT * FROM drivers WHERE phone = $1`,
      [phone]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Telefon raqam noto‘g‘ri yoki haydovchi mavjud emas" });
    }

    const driver = result.rows[0];

    // Parolni tekshiramiz
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Parol noto‘g‘ri" });
    }

    // Token yaratamiz
    const token = jwt.sign(
      {
        id: driver.id,
        role: "driver",
        full_name: driver.full_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Javob
    res.json({
      message: "Kirish muvaffaqiyatli",
      token,
      driver: {
        id: driver.id,
        full_name: driver.full_name,
        phone: driver.phone,
        email: driver.email,
        role: "driver",
      },
    });
  } catch (error) {
    console.error("Haydovchi loginida xatolik:", error);
    res.status(500).json({ error: "Login jarayonida server xatosi" });
  }
};
