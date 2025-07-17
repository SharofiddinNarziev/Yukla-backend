const pool = require("../../config/db");

module.exports = async function getAllOrders(req, res) {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY created_at DESC");
    res.json({ orders: resust.rows });
  } catch (error) {
    console.error("Buyurtmalarni olishda xatolik!", error);
    res.status(500).json({ error: "Buyurtmalar olinmadi" });
  }
};