const pool = require('../config/db');
const bcrypt = require('bcrypt');

// Haydovchi modelini yaratish
class Driver {
  // Haydovchini yaratish
  static async createDriver(data) {
    const { full_name, phone, email, password, vehicle_type, vehicle_number, vehicle_capacity, vehicle_model, license_number, license_expiry } = data;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
      INSERT INTO drivers (full_name, phone, email, password, vehicle_type, vehicle_number, vehicle_capacity, vehicle_model, license_number, license_expiry) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
    `;
    const values = [full_name, phone, email, hashedPassword, vehicle_type, vehicle_number, vehicle_capacity, vehicle_model, license_number, license_expiry];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Haydovchi topish (telefon orqali)
  static async findByPhone(phone) {
    const query = 'SELECT * FROM drivers WHERE phone = $1';
    const result = await pool.query(query, [phone]);
    return result.rows[0];
  }
}

module.exports = Driver;
