const pool = require("../config/db");

/**
 * ASST_ADMIN: View Registered Users
 */
exports.getRegisteredUsers = async (req, res) => {
    const result = await pool.query(
        `SELECT u.id, u.name, u.email
     FROM registrations r
     JOIN users u ON u.id = r.user_id
     WHERE r.event_id=$1`,
        [req.params.eventId]
    );
    res.json(result.rows);
};

/**
 * ASST_ADMIN: Mark Present
 */
exports.markPresent = async (req, res) => {
    const { userId } = req.body;

    await pool.query(
        `INSERT INTO attendance (event_id, user_id, present, marked_by)
     VALUES ($1,$2,true,$3)
     ON CONFLICT (event_id, user_id)
     DO UPDATE SET present=true, marked_by=$3`,
        [req.params.eventId, userId, req.user.id]
    );

    res.json({ message: "Marked present" });
};
