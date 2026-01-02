const pool = require("../config/db");

/**
 * ASST_ADMIN / ADMIN
 * Create Event
 */
exports.createEvent = async (req, res) => {
    const { title, description, event_date } = req.body;

    try {
        const result = await pool.query(
            `
      INSERT INTO events (title, description, event_date, created_by)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
            [title, description, event_date, req.user.id]
        );

        // Emails removed

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Create event error:", err);
        res.status(500).json({ message: "Failed to create event" });
    }
};

/**
 * ALL USERS
 * Upcoming Events (with registration status)
 */
exports.getUpcomingEvents = async (req, res) => {
    try {
        const result = await pool.query(
            `
      SELECT 
        e.*,
        CASE WHEN r.user_id IS NULL THEN false ELSE true END AS is_registered
      FROM events e
      LEFT JOIN registrations r
        ON r.event_id = e.id
        AND r.user_id = $1
      WHERE e.status = 'UPCOMING'
      ORDER BY e.event_date ASC
      `,
            [req.user.id]
        );

        res.json(result.rows);
    } catch (err) {
        console.error("Fetch events error:", err);
        res.status(500).json({ message: "Failed to fetch events" });
    }
};

/**
 * ALL USERS
 * Event Details
 */
exports.getEventById = async (req, res) => {
    try {
        const result = await pool.query(
            `
      SELECT 
        e.*,
        CASE WHEN r.user_id IS NULL THEN false ELSE true END AS is_registered
      FROM events e
      LEFT JOIN registrations r
        ON r.event_id = e.id
        AND r.user_id = $1
      WHERE e.id = $2
      `,
            [req.user.id, req.params.eventId]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error("Fetch event error:", err);
        res.status(500).json({ message: "Failed to fetch event" });
    }
};

/**
 * ASST_ADMIN / ADMIN
 * Update Joining Link
 */
exports.updateJoiningLink = async (req, res) => {
    const { joining_link } = req.body;
    const { eventId } = req.params;

    try {
        await pool.query(
            "UPDATE events SET joining_link = $1 WHERE id = $2",
            [joining_link, eventId]
        );

        // Emails removed

        res.json({ message: "Joining link updated" });
    } catch (err) {
        console.error("Update joining link error:", err);
        res.status(500).json({ message: "Failed to update joining link" });
    }
};

/**
 * ASST_ADMIN / ADMIN
 * Complete Event
 */
exports.completeEvent = async (req, res) => {
    try {
        await pool.query(
            "UPDATE events SET status = 'COMPLETED' WHERE id = $1",
            [req.params.eventId]
        );

        res.json({ message: "Event marked as completed" });
    } catch (err) {
        console.error("Complete event error:", err);
        res.status(500).json({ message: "Failed to complete event" });
    }
};
