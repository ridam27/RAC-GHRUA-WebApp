const pool = require("../config/db");
const { hashPassword } = require("../utils/password");

/**
 * POST /auth/signup
 * Body: { name, email, mobile, dob, university, password, confirmPassword }
 */
exports.signup = async (req, res) => {
    const { name, email, mobile, dob, university, password, confirmPassword } = req.body;

    try {
        // 1️⃣ Basic validation
        if (!name || !email || !mobile || !dob || !university || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        // 2️⃣ Check if email or mobile already exists
        const exists = await pool.query(
            "SELECT * FROM users WHERE email=$1 OR mobile=$2",
            [email, mobile]
        );

        if (exists.rows.length > 0) {
            return res.status(400).json({ message: "Email or mobile already exists" });
        }

        // 3️⃣ Hash password
        const password_hash = await hashPassword(password);

        // 4️⃣ Insert into DB
        const result = await pool.query(
            `
      INSERT INTO users 
      (name, email, mobile, dob, university, password_hash, system_role, club_role, club_fee_status, is_active, created_at)
      VALUES ($1,$2,$3,$4,$5,$6,'MEMBER',NULL,'UNPAID',true,NOW())
      RETURNING id, name, email, mobile, dob, university, system_role, club_role, club_fee_status, is_active, created_at
      `,
            [name, email, mobile, dob, university, password_hash]
        );

        // 5️⃣ Success response
        return res.status(201).json({
            message: "Signup successful! Please login.",
            user: result.rows[0]
        });

    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Failed to create account" });
    }
};
