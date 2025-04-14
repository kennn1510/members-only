require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function getUser(userId) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  return rows[0];
}

module.exports = { getUser };
