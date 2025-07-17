const pool = require("../../config/db");
const logAction = require("../../utils/logger");

module.exports = async (req, res) => {
  try {
    const { pickup_location, dropoff_location, cargo_details, price } = req.body;
    const client_id = req.user.id;

    const result = await pool.query(
      `INSERT INTO orders (client_id, pickup_location, dropoff_location, cargo_details, price)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [client_id, pickup_location, dropoff_location, cargo_details, price]
    );

    await logAction({
      user_id: client_id,
      role: req.user.role,
      action: "create_order",
      target_type: "order",
      target_id: result.rows[0].id
    });

    res.status(201).json({ message: "Buyurtma yaratildi!", order: result.rows[0] });
  } catch (error) {
    console.error("❌ Buyurtma yaratishda xatolik:", error.message, error.stack);
    res.status(500).json({ message: "Serverda xatolik.", detail: error.message });
  }
};
