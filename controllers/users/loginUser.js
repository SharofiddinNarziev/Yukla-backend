const pool = require("../../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports = async function loginUser(req, res) {
  const { email, password } = req.body;

  try {
    // Foydalanuvchini topish
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR phone = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
    }

    const user = result.rows[0];

    // Parolni tekshirish
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Email yoki parol noto‘g‘ri" });
    }

    // JWT token yaratish (MUHIM: role ni ham qo‘shamiz)
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role, // bu bo'lishi kerak
        full_name: user.full_name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Tizimga muvaffaqiyatli kirildi",
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login xatosi:", error);
    res.status(500).json({ error: "Serverda xatolik yuz berdi" });
  }
};
