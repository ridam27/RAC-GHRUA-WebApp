const pool = require("../config/db");

/**
 * MEMBER DASHBOARD
 */
exports.memberDashboard = async (req, res) => {
    const userId = req.user.id;

    // 1️⃣ Total completed events
    const totalEventsResult = await pool.query(
        "SELECT COUNT(*) FROM events WHERE status = 'COMPLETED'"
    );
    const totalEvents = Number(totalEventsResult.rows[0].count);

    // 2️⃣ Registered events (completed only)
    const registeredResult = await pool.query(
        `
        SELECT COUNT(*) 
        FROM registrations r
        JOIN events e ON r.event_id = e.id
        WHERE r.user_id = $1 AND e.status = 'COMPLETED'
        `,
        [userId]
    );
    const registeredEvents = Number(registeredResult.rows[0].count);

    // 3️⃣ Attended events (present = true)
    const attendedResult = await pool.query(
        `
        SELECT COUNT(*) 
        FROM attendance a
        JOIN events e ON a.event_id = e.id
        WHERE a.user_id = $1 
          AND a.present = true 
          AND e.status = 'COMPLETED'
        `,
        [userId]
    );
    const attended = Number(attendedResult.rows[0].count);

    // 4️⃣ Missed events
    const missed = totalEvents - attended;

    // 5️⃣ Attendance percentage
    const attendancePercentage =
        totalEvents === 0
            ? 0
            : Math.round(((totalEvents - missed) / totalEvents) * 100);

    res.json({
        total_events: totalEvents,
        registered_events: registeredEvents,
        attended,
        missed,
        attendance_percentage: attendancePercentage
    });
};


/**
 * ASST ADMIN DASHBOARD
 */
exports.asstAdminDashboard = async (req, res) => {

    // 1️⃣ Get all events
    const events = await pool.query(
        "SELECT id, title, status FROM events"
    );

    const totalEvents = events.rows.length;
    const upcoming = events.rows.filter(e => e.status === "UPCOMING").length;
    const completed = events.rows.filter(e => e.status === "COMPLETED").length;

    // 2️⃣ Attendance per event (all events)
    const attendance = await pool.query(
        `
        SELECT 
            e.id,
            e.title,
            e.event_date,
            e.status,
            e.certificate_status,
            COUNT(a.user_id) FILTER (WHERE a.present = true) AS present_count,
            COUNT(a.user_id) FILTER (WHERE a.present = false) AS absent_count
        FROM events e
        LEFT JOIN attendance a ON e.id = a.event_id
        GROUP BY e.id, e.title
        ORDER BY e.title
        `
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

