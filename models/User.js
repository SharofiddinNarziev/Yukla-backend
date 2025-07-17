const pool = require("../config/db");
const bcrypt = require("bcryptjs");

class User {
  // Email yoki telefon orqali qidirish
  static async findByEmailOrPhone(emailOrPhone) {
    const query = `
      SELECT * FROM users
      WHERE email = $1 OR phone = $1
      LIMIT 1;
    `;
    const result = await pool.query(query, [emailOrPhone]);
    return result.rows[0];
  }

  // Yangi mijoz yaratish
  static async createUser(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const query = `
      INSERT INTO users (full_name, phone, email, password, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *;
    `;
    const values = [data.full_name, data.phone, data.email, hashedPassword];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}

module.exports = User;
