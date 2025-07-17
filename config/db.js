const { Pool } = require('pg');
require('dotenv').config();

console.log("🔍 DB_HOST:", process.env.DB_HOST); // Debug

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
