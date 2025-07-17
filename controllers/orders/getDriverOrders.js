const pool = require("../../config/db");

module.exports = async function getDriverOrders(req, res) {
  const driver_id = req.user.id;

  try {
    const result = await pool.query(
      `SELECT * FROM orders
       WHERE status = 'pending'
       AND id NOT IN (
         SELECT order_id FROM rejected_orders WHERE driver_id =$1
      )`,
     [driver_id]
    );
    res.json({ orders: result.rows });
  } catch (error) {
    console.error("Haydovchi buyurtmalarini olishda xarolik:", error);
    res.status(500).json({ error: "Buyurtmalarni olishda xatolik yuz berdi" });
  }
};
