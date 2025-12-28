const pool = require("../config/db");

/**
 * ASST_ADMIN: View Registered Users
 */
exports.getRegisteredUsers = async (req, res) => {
    try {
        const { eventId } = req.params;

        const result = await pool.query(
            `
      SELECT
        u.id,
        u.name,
        u.email,
        COALESCE(a.present, false) AS present
      FROM registrations r
      JOIN users u
        ON u.id = r.user_id
      LEFT JOIN attendance a
        ON a.user_id = u.id
       AND a.event_id = r.event_id
      WHERE r.event_id = $1
      ORDER BY u.name
      `,
            [eventId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to load attendance" });
    }
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
