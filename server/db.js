const { Pool } = require("pg");
require("dotenv").config();

// Connection pool is reused across the entire application.
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "decor_store",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres"
});

module.exports = pool;
