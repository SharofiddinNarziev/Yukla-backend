const pool = require("../../config/db");

module.exports = async function acceptOrder(req, res) {
  const driver_id = req.user?.id;
  const order_id = req.params.id;

  if (!driver_id || !order_id) {
    return res.status(400).json({ error: "Haydovchi yoki buyurtma ID topilmadi" });
  }

  try {
    const result = await pool.query(
      `UPDATE orders 
       SET driver_id = $1, status = 'accepted', updated_at = NOW()
       WHERE id = $2 AND status = 'pending'
       RETURNING *`,
      [driver_id, order_id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        message: "Buyurtma mavjud emas yoki allaqachon qabul qilingan"
      });
    }

    return res.status(200).json({
      message: "Buyurtma muvaffaqiyatli qabul qilindi",
      order: result.rows[0]
    });
  } catch (error) {
    console.error("❌ Buyurtmani qabul qilishda xatolik:", error.stack || error);
    return res.status(500).json({ error: "Ichki server xatoligi" });
  }
};