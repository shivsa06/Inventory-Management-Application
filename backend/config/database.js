const mysql = require("mysql2");

require("dotenv").config();

if (
  !process.env.DB_HOST ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_NAME
) {
  console.error("Error: Missing environment variables in .env file");
  process.exit(1);
}

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
});

db.connect((error) => {
  if (error) {
    console.log("Error Connecting to Database: ", error);
    return;
  }
  console.log("Successfully connected to Database");
});

module.exports = db;
