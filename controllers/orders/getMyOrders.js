const pool = require("../../config/db");

module.exports = async function getMyOrders(req, res) {
  try {
    const user_id = req.user.id;
    const result = await pool.query(
      `SELECT * FROM orders WHERE client_id = $1 ORDER BY created_at DESC`,
      [user_id]
    );
    res.json({ orders: result.rows });
  } catch (error) {
    console.error("Mijoz buyurtmalarini olishda xatolik!", error);
    res.status(500).json({ error: "Buyurtmalar olinmadi" });
  }
};
