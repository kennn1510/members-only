const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createMessage = async (title, text, userId) => {
  const query =
    "INSERT INTO messages (title, text, user_id) VALUES ($1, $2, $3)";
  const values = [title, text, userId];
  try {
    await pool.query(query, values);
  } catch (error) {
    console.error("Error creating message:", error);
    throw error;
  }
};

const getAllMessages = async () => {
  const query =
    "SELECT m.id, m.title, m.text, m.timestamp, u.full_name, u.id AS user_id FROM messages m JOIN users u ON m.user_id = u.id ORDER BY m.timestamp DESC";
  try {
    const result = await pool.query(query);
    return result.rows;
  } catch (error) {
    console.error("Error getting all messages:", error);
    throw error;
  }
};

const deleteMessage = async (messageId) => {
  const query = "DELETE FROM messages WHERE id = $1";
  const values = [messageId];
  try {
    await pool.query(query, values);
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
};

module.exports = { createMessage, getAllMessages, deleteMessage };
