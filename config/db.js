// config/db.js
const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

// 🧪 Log orqali tekshirib ko‘ramiz
console.log("🔗 DBga ulanish uchun foydalanuvchi:", process.env.DB_USER);

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
});

module.exports = pool;
