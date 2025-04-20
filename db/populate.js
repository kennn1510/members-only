require("dotenv").config();
const {Client} = require("pg");
const bcrypt = require("bcryptjs");

const SQL = `
    CREATE TABLE IF NOT EXISTS users
    (
        id
        INTEGER
        PRIMARY
        KEY
        GENERATED
        ALWAYS AS
        IDENTITY,
        firstname
        VARCHAR
        NOT
        NULL,
        lastname
        VARCHAR
        NOT
        NULL,
        username
        VARCHAR
        UNIQUE
        NOT
        NULL,
        password
        VARCHAR
        NOT
        NULL
    );

    CREATE TABLE IF NOT EXISTS messages
    (
        id
        INTEGER
        PRIMARY
        KEY
        GENERATED
        ALWAYS AS
        IDENTITY,
        message
        VARCHAR,
        message_time
        TIME,
        user_id
        INTEGER
        REFERENCES
        users
    (
        id
    )
        );
`;

async function seedDefaultUser() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  try {
    console.log("Seeding...");
    await client.connect();
    await client.query(SQL);
    const hashedPassword = await bcrypt.hash("password123", 10);
    await client.query(
      "INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4)",
      ["Mario", "Luigi", "some@email.com", hashedPassword]
    );
    console.log("Seeding Done.");
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

seedDefaultUser();
