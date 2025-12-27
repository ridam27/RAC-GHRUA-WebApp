const pool = require("../config/db");
const { hashPassword } = require("../utils/password");

/**
 * ADMIN: Create new user
 */
exports.createUser = async (req, res) => {
    const {
        name,
        email,
        mobile,
        dob,
        university,
        password,
        system_role,
        club_role,
        club_fee_status
    } = req.body;

    try {
        const passwordHash = await hashPassword(password);

        const result = await pool.query(
            `INSERT INTO users
      (name, email, mobile, dob, university, password_hash, system_role, club_role, club_fee_status)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING id, name, email, system_role, club_role, club_fee_status`,
            [
                name,
                email,
                mobile,
                dob,
                university,
                passwordHash,
                system_role || "MEMBER",
                club_role,
                club_fee_status || "UNPAID"
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({ message: "Email already exists" });
        }
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ADMIN & ASST_ADMIN: Get all users
 */
exports.getAllUsers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email, mobile, system_role, club_role, club_fee_status
       FROM users
       ORDER BY created_at DESC`
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * ADMIN: Update fee status
 */
exports.updateFeeStatus = async (req, res) => {
    const { userId } = req.params;
    const { club_fee_status } = req.body;

    try {
        await pool.query(
            "UPDATE users SET club_fee_status=$1 WHERE id=$2",
            [club_fee_status, userId]
        );
        res.json({ message: "Fee status updated" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
