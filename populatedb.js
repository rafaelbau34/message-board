require("dotenv").config();
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  "user" VARCHAR ( 255 ) NOT NULL,
  text TEXT NOT NULL,
  added TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO messages ("user", text) 
VALUES
  ('Amando', 'Hi there!'),
  ('Charles', 'Hello World!');
`;

async function main() {
  console.log("Seeding database...");
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log("Database seeded!");
}

main();
