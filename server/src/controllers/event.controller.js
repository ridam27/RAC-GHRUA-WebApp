const pool = require("../config/db");

/**
 * ASST_ADMIN: Create Event
 */
exports.createEvent = async (req, res) => {
    const { title, description, event_date } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO events (title, description, event_date, created_by)
        VALUES ($1,$2,$3,$4)
       RETURNING *`,
            [title, description, event_date, req.user.id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Failed to create event" });
    }
};

/**
 * ALL USERS: Upcoming Events
 */
exports.getUpcomingEvents = async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM events WHERE status='UPCOMING' ORDER BY event_date ASC"
    );
    res.json(result.rows);
};

/**
 * Event Details
 */
exports.getEventById = async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM events WHERE id=$1",
        [req.params.eventId]
    );
    res.json(result.rows[0]);
};

/**
 * ASST_ADMIN: Upload / Update Joining Link
 */
exports.updateJoiningLink = async (req, res) => {
    const { joining_link } = req.body;

    await pool.query(
        "UPDATE events SET joining_link=$1 WHERE id=$2",
        [joining_link, req.params.eventId]
    );

    res.json({ message: "Joining link updated" });
};

/**
 * ASST_ADMIN: Mark Event Complete
 */
exports.completeEvent = async (req, res) => {
    await pool.query(
        "UPDATE events SET status='COMPLETED' WHERE id=$1",
        [req.params.eventId]
    );
    res.json({ message: "Event marked as completed" });
};
