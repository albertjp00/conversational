const {Pool} = require('pg')
require('dotenv').config()

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL is missing in environment variables.");
  process.exit(1); 
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  }
});


