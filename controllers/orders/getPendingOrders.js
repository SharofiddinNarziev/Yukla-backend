const pool = require('../../config/db');

module.exports = async function getPendingOrders(req, res) {
  try {
    const result = await pool.query(`
      SELECT 
        o.id, o.pickup_location, o.dropoff_location,
        o.cargo_details, o.price, o.status,
        u.full_name AS client_name
      FROM orders o
      JOIN users u ON o.client_id = u.id
      WHERE o.status = 'pending'
      ORDER BY o.created_at DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('❌ Pending buyurtmalarni olishda xatolik:', error.message);
    res.status(500).json({ error: 'Buyurtmalarni olishda server xatosi' });
  }
};
