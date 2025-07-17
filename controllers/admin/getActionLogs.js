const pool = require("../../config/db");

module.exports = async function getActionLogs(req, res) {
  try {
    const result = await pool.query(`
      SELECT * FROM action_logs ORDER BY created_at DESC LIMIT 100
    `);
    res.json({ logs: result.rows });
  } catch (error) {
    console.error("📌 Loglarni olishda xatolik:", error.message);
    res.status(500).json({ error: "Loglarni olishda xatolik" });
  }
};
