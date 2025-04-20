require("dotenv").config();
const {Pool} = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function getUserById(userId) {
  const {rows} = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  return rows[0];
}

async function getUserByUsername(username) {
  const {rows} = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return rows[0];
}

async function createUser(firstName, lastName, username, password) {
  await pool.query(
    "INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4)",
    [firstName, lastName, username, password]
  );
}

module.exports = {getUserById, getUserByUsername, createUser};
