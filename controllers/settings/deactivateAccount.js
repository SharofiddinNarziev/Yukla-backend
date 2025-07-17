const pool = require("../../config/db");

module.exports = async function deactivateAccount(req, res) {
  const userId = req.user.id;

  try {
    await pool.query(
      `UPDATE users SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
      [userId]
    );
    res.json({ message: "Hisob vaqtincha o‘chirildi" });
  } catch (error) {
    console.error("Hisobni o‘chirishda xatolik:", error);
    res.status(500).json({ error: "Hisobni o‘chirishda xatolik" });
  }
};
