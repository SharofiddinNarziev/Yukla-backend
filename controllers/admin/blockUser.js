const pool = require("../../config/db");
const logAction = require("../../utils/logger");

module.exports = async (req, res) => {
  const userId = req.params.id;

  try {
    const result = await pool.query(
      `UPDATE users SET is_active = false WHERE id = $1 RETURNING *`,
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    // ✅ Log yozish uchun async kerak
    await logAction({
      user_id: req.user.id,
      role: req.user.role,
      action: "block_user",
      target_type: "user",
      target_id: userId
    });

    res.json({ message: "Foydalanuvchi bloklandi", user: result.rows[0] });
  } catch (error) {
    console.error("Foydalanuvchini bloklashda xatolik:", error.message);
    res.status(500).json({ error: "Bloklab bo‘lmadi" });
  }
};
