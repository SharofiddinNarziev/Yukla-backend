const pool = require("../../config/db");
const logAction = require("../../utils/logger");

module.exports = async (req, res) => {
  try {
    const driver_id = req.user.id;
    const order_id = req.params.id;

    const check = await pool.query(
      `SELECT * FROM rejected_orders WHERE order_id = $1 AND driver_id = $2`,
      [order_id, driver_id]
    );

    if (check.rowCount > 0) {
      return res.status(400).json({ message: "Siz bu buyurtmani allaqachon rad qilgansiz." });
    }

    await pool.query(
      `INSERT INTO rejected_orders (order_id, driver_id, rejected_at)
       VALUES ($1, $2, CURRENT_TIMESTAMP)`,
      [order_id, driver_id]
    );

    // ✅ log yozish uchun async kerak
    await logAction({
      user_id: req.user.id,
      role: req.user.role,
      action: "reject_order",
      target_type: "order",
      target_id: order_id
    });

    res.json({ message: "Buyurtma rad etildi." });
  } catch (error) {
    console.error("Rad etishda xatolik:", error.message);
    res.status(500).json({ error: "Buyurtmani rad etib bo‘lmadi" });
  }
};
