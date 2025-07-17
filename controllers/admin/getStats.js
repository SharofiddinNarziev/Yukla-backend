const pool = require("../../config/db");

module.exports = async function getStats(req, res) {
  try {
    const users = await pool.query("SELECT COUNT(*) FROM users");
    const drivers = await pool.query("SELECT COUNT(*) FROM drivers");
    const orders = await pool.query("SELECT COUNT(*) FROM orders");

    res.json({
      users: Number(users.rows[0].count),
      drivers: Number(drivers.rows[0].count),
      orders: Number(orders.rows[0].count),
    });
  } catch (error) {
    console.error("Statistika olishda xatolik:", error);
    res.status(500).json({ error: "Statistikani olishda xatolik" });
  }
};
