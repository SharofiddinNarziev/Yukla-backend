const pool = require("../../config/db");

module.exports = async function getAllUsers(req, res) {
  try {
    const result = await pool.query("SELECT id, full_name, phone, is_active FROM users ORDERS BY created_at DESC");
    res.json({ drivers: result.rows });
  } catch (error) {
    console.error("Haydovchilarni olishda xatolik:", error);
    res.status(500).json({ error: "Haydovchilar olinmadi" });
  }
};