const { Pool } = require("pg");

// Use DATABASE_URL for simplicity
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Early connection test to catch errors immediately
pool.connect()
    .then(() => console.log("✅ Database connected successfully"))
    .catch((err) => {
        console.error("❌ Database connection failed:");
        console.error(err);
    });

module.exports = pool;
