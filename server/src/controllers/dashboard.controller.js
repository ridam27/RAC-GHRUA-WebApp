const pool = require("../config/db");

/**
 * MEMBER DASHBOARD
 */
exports.memberDashboard = async (req, res) => {
    const userId = req.user.id;

    const totalEvents = await pool.query(
        "SELECT COUNT(*) FROM registrations WHERE user_id=$1",
        [userId]
    );

    const attended = await pool.query(
        "SELECT COUNT(*) FROM attendance WHERE user_id=$1 AND present=true",
        [userId]
    );

    const missed = totalEvents.rows[0].count - attended.rows[0].count;

    res.json({
        total_registered: totalEvents.rows[0].count,
        attended: attended.rows[0].count,
        missed,
        attendance_percentage:
            totalEvents.rows[0].count == 0
                ? 0
                : Math.round(
                    (attended.rows[0].count / totalEvents.rows[0].count) * 100
                )
    });

};
