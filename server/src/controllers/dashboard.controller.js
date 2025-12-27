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

/**
 * ASST ADMIN DASHBOARD
 */
exports.asstAdminDashboard = async (req, res) => {
    const userId = req.user.id;

    const events = await pool.query(
        "SELECT id, title, status FROM events WHERE created_by=$1",
        [userId]
    );

    const totalEvents = events.rows.length;

    const upcoming = events.rows.filter(e => e.status === "UPCOMING").length;
    const completed = events.rows.filter(e => e.status === "COMPLETED").length;

    const attendance = await pool.query(
        `SELECT e.title,
            COUNT(a.user_id) FILTER (WHERE a.present=true) AS present_count
     FROM events e
     LEFT JOIN attendance a ON e.id = a.event_id
     WHERE e.created_by=$1
     GROUP BY e.title`,
        [userId]
    );

    res.json({
        total_events: totalEvents,
        upcoming_events: upcoming,
        completed_events: completed,
        attendance_by_event: attendance.rows
    });
};

/**
 * ADMIN DASHBOARD
 */
exports.adminDashboard = async (req, res) => {
    const users = await pool.query("SELECT system_role, club_fee_status FROM users");
    const events = await pool.query("SELECT status FROM events");

    const summary = {
        total_users: users.rowCount,
        admins: users.rows.filter(u => u.system_role === "ADMIN").length,
        asst_admins: users.rows.filter(u => u.system_role === "ASST_ADMIN").length,
        members: users.rows.filter(u => u.system_role === "MEMBER").length,

        paid: users.rows.filter(u => u.club_fee_status === "PAID").length,
        partial: users.rows.filter(u => u.club_fee_status === "PARTIAL").length,
        unpaid: users.rows.filter(u => u.club_fee_status === "UNPAID").length,

        total_events: events.rowCount,
        upcoming_events: events.rows.filter(e => e.status === "UPCOMING").length,
        completed_events: events.rows.filter(e => e.status === "COMPLETED").length
    };

    res.json(summary);
};

