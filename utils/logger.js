const pool = require("../config/db");

async function logAction({ user_id, role, action, target_type, target_id }) {
  try {
    await pool.query(
      `INSERT INTO action_logs (user_id, role, action, target_type, target_id)
       VALUES ($1, $2, $3, $4, $5)`,
      [user_id, role, action, target_type, target_id]
    );
  } catch (error) {
    console.error("📌 Log yozishda xatolik:", error.message);
  }
}

module.exports = logAction;
