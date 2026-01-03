const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const { comparePassword } = require("../utils/password");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE email=$1 AND is_active=true",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const user = result.rows[0];
        const isMatch = await comparePassword(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                system_role: user.system_role,
                club_role: user.club_role
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                system_role: user.system_role,
                club_role: user.club_role,
                club_fee_status: user.club_fee_status
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
