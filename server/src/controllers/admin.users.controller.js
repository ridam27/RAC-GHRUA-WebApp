const pool = require("../config/db");

/**
 * ADMIN: Get all users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
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
      ORDER BY name
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

/**
 * ADMIN: Update user profile
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    mobile,
    email,
    dob,
    university,
    system_role,
    club_role,
    club_fee_status
  } = req.body;

  try {
    await pool.query(
      `
      UPDATE users SET
        name=$1,
        mobile=$2,
        email=$3,
        dob=$4,
        university=$5,
        system_role=$6,
        club_role=$7,
        club_fee_status=$8
      WHERE id=$9
      `,
      [
        name,
        mobile,
        email,
        dob,
        university,
        system_role,
        club_role,
        club_fee_status,
        id
      ]
    );

    res.json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update user" });
  }
};
