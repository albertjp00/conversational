const {Pool} = require('pg')
require('dotenv').config()

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing in environment variables.");
  process.exit(1); // Exit the process to prevent app from running without DB
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Accept self-signed certs (for testing)
  }
});


module.exports = pool