const pool = require("../../config/db");
const logAction = require("../../utils/logger");

module.exports = async (req, res) => {
  const orderId = req.params.id;
  const { rating, feedback } = req.body;
  const client_id = req.user.id;

  if (req.user.role !== "client" && req.user.role !== "customer") {
    return res.status(403).json({ message: "Faqat mijoz yakunlay oladi" });
  }

  try {
    const result = await pool.query(
      `UPDATE orders SET status = 'completed', rating = $1, feedback = $2
       WHERE id = $3 AND client_id = $4
       RETURNING *`,
      [rating || null, feedback || null, orderId, client_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Buyurtma topilmadi yoki sizga tegishli emas" });
    }

    // ✅ Log yozish
    await logAction({
      user_id: req.user.id,
      role: req.user.role,
      action: "complete_order",
      target_type: "order",
      target_id: orderId
    });

    res.json({ message: "Buyurtma yakunlandi", order: result.rows[0] });
  } catch (error) {
    console.error("Buyurtmani yakunlashda xatolik:", error.message);
    res.status(500).json({ error: "Buyurtmani yakunlab bo‘lmadi" });
  }
};
