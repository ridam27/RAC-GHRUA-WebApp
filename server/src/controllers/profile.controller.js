const pool = require("../config/db");

/**
 * Get own profile
 */
exports.getProfile = async (req, res) => {
    try {
        const result = await pool.query(
            `
      SELECT 
        id,
        name,
        mobile,
        email,
        dob::text AS dob,
        university,
        system_role,
        club_role,
        club_fee_status
      FROM users
      WHERE id = $1
      `,
            [req.user.id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Failed to load profile" });
    }
};

/**
 * Update own profile (restricted fields)
 */
exports.updateProfile = async (req, res) => {
    const { name, mobile, email, dob, university } = req.body;

    try {
        await pool.query(
            `
      UPDATE users SET
        name=$1,
        mobile=$2,
        dob=$3,
        university=$4
      WHERE id=$5
      `,
            [name, mobile, dob, university, req.user.id]
        );

        res.json({ message: "Profile updated" });
    } catch (err) {
        res.status(500).json({ message: "Failed to update profile" });
    }
};
