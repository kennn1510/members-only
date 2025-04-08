const { Pool } = require("pg");
const bcrypt = require("bcrypt");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const createUser = async (fullName, username, password) => {
  const hashedPassword = bcrypt.hash(password, 10); // Intentionally left out await to see what bug shows up
  try {
    await pool.query(
      "INSERT INTO users (full_name, username, password) VALUES ($1, $2, $3)",
      [fullName, username, password]
    );
  } catch (error) {
    console.error(`Error creating user: ${error}`);
    throw error;
  }
};

const findUserByUsername = async (username) => {
  const query = "SELECT * FROM users WHERE username = $1";
  const values = [username];
  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error finding user by username:", error);
    throw error;
  }
};

const updateUserMembership = async (userId, membershipStatus) => {
  const query = "UPDATE users SET membership_status = $1 WHERE id = $2";
  const values = [membershipStatus, userId];
  try {
    await pool.query(query, values);
  } catch (error) {
    console.error("Error updating user membership:", error);
    throw error;
  }
};

const updateUserAdminStatus = async (userId, isAdmin) => {
  const query = "UPDATE users SET is_admin = $1 WHERE id = $2";
  const values = [isAdmin, userId];
  try {
    await pool.query(query, values);
  } catch (error) {
    console.error("Error updating user admin status:", error);
    throw error;
  }
};

module.exports = { createUser, findUserByUsername, updateUserMembership, updateUserAdminStatus };
