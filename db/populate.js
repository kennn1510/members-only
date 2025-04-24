require("dotenv").config();
const { Client } = require("pg");

const dbURL = process.argv[2];

const SQL = `
    CREATE TABLE IF NOT EXISTS users
    (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        firstname VARCHAR NOT NULL,
        lastname VARCHAR NOT NULL,
        username VARCHAR UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        membership BOOLEAN DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS messages
    (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        message VARCHAR,
        message_time TIMESTAMP DEFAULT NOW(),
        user_id INTEGER REFERENCES users(id));
`;

async function seedDefaultUser() {
  const client = new Client({
    connectionString: dbURL,
  });
  try {
    console.log("Attempting to connect with:", dbURL);
    await client.connect();
    console.log("Successfully connected!");
  } catch (err) {
    console.error("Connection error:", err);
  } finally {
    await client.end();
  }
  // try {
  //   console.log("Seeding...");
  //   await client.connect();
  //   await client.query(SQL);
  //   const hashedPassword = await bcrypt.hash("password123", 10);
  //   await client.query(
  //     "INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4)",
  //     ["Mario", "Luigi", "some@email.com", hashedPassword]
  //   );
  //   console.log("Seeding Done.");
  // } catch (err) {
  //   console.error(err);
  // } finally {
  //   await client.end();
  // }
}

seedDefaultUser();
