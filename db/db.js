require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function getUserById(userId) {
  const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
    userId,
  ]);
  return rows[0];
}

async function getUserByUsername(username) {
  const { rows } = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return rows[0];
}

async function createUser(firstName, lastName, username, password) {
  await pool.query(
    "INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4)",
    [firstName, lastName, username, password],
  );
}

async function updateMembership(userId) {
  await pool.query("UPDATE users SET membership = true WHERE id = $1", [
    userId,
  ]);
}

async function createNewMessage(message, userId) {
  await pool.query("INSERT INTO messages (message, user_id) VALUES ($1, $2)", [
    message,
    userId,
  ]);
}

async function getAllMessages() {
  try {
    const { rows } = await pool.query(`
    SELECT
      m.id AS message_id, -- Alias the message ID to avoid confusion
      m.message,
      m.message_time,
      m.user_id,
      u.firstname,
      u.lastname
    FROM
      messages m
    JOIN
      users u ON m.user_id = u.id
    ORDER BY
      m.message_time DESC; -- Optional: Order messages by time, newest first
      `);
    return rows;
  } catch (error) {
    console.error("Error fetching all messages with user data:", error);
    throw error;
  }
}

module.exports = {
  getUserById,
  getUserByUsername,
  createUser,
  updateMembership,
  createNewMessage,
  getAllMessages,
};
