const pool = require("../../config/db");

module.exports = async function getAllUsers(req, res) {
  try {
    const result = await pool.query("SELECT id, full_name, email, phone, is_active FROM users ORDER BY created_at DESC");
    res.json({ users: result.rows });
  } catch (error) {
    console.error("Foydalanuvchilarni olishda xatolik:", error);
    res.status(500).json({ error: "Foydalanuvchilar olinmadi" });
  }
};
