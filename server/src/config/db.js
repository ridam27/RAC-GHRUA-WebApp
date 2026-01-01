const { Pool } = require("pg");

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
});

pool.connect()
    .then(() => console.log("✅ Database connected successfully"))
    .catch((err) => {
        console.error("❌ Database connection failed:");
        console.error(err);
    })

module.exports = pool;
