const pool = require("../../config/db");
const bcrypt = require("bcrypt");

module.exports = async function changePassword(req,res) {
  const userId = req.user.id;
  const { oldPassword, newPassword } = req.body;

  try {
    const userResult = await pool.query(
     `SELECT password FROM users WHERE id = $1`,
     [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi" });
    }

    const user = userResult.rows[0];
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    
    if (!isMatch) {
       return res.status(401).json({ error: "eski parol noto‘g‘ri" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    

    await pool.query(
      `UPDATE users SET password = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`,
      [hashed, userId]
    );

    res.json({ message: "Parol yangilandi" });
  } catch (error) {
    console.error("Parolni yangilashda xatolik:", error);
    res.status(500).json({error: "Parolni o‘zgartirib bo‘lmadi" });

  }
};