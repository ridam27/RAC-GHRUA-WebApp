const pool = require("../config/db");
const { sendEmail } = require("../utils/mailer");

/**
 * ASST_ADMIN / ADMIN
 * Create Event
 * Email → All MEMBERS
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

        // Notify all members
        const members = await pool.query(
            "SELECT email FROM users WHERE system_role = 'MEMBER'"
        );

        for (const member of members.rows) {
            await sendEmail(
                member.email,
                "New Rotaract Event Added",
                `
                <p><strong>${title}</strong> has been added.</p>
                <p>Please login to the RAC GHRUA portal to view details.</p>
                `
            );
        }

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("Create event error:", err);
        res.status(500).json({ message: "Failed to create event" });
    }
};

/**
 * ALL USERS
 * Upcoming Events
 * Includes is_registered flag
 */
exports.getUpcomingEvents = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT 
                e.*,
                CASE 
                    WHEN r.user_id IS NULL THEN false
                    ELSE true
                END AS is_registered
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
 * Includes is_registered flag
 */
exports.getEventById = async (req, res) => {
    try {
        const result = await pool.query(
            `
            SELECT 
                e.*,
                CASE 
                    WHEN r.user_id IS NULL THEN false
                    ELSE true
                END AS is_registered
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
 * Upload or Update Joining Link
 * Email → REGISTERED USERS
 */
exports.updateJoiningLink = async (req, res) => {
    const { joining_link } = req.body;
    const { eventId } = req.params;

    try {
        await pool.query(
            "UPDATE events SET joining_link = $1 WHERE id = $2",
            [joining_link, eventId]
        );

        const users = await pool.query(
            `
            SELECT u.email
            FROM registrations r
            JOIN users u ON u.id = r.user_id
            WHERE r.event_id = $1
            `,
            [eventId]
        );

        for (const user of users.rows) {
            await sendEmail(
                user.email,
                "Event Joining Link Updated – Rotaract GHRUA",
                `
                <p>Hello,</p>
                <p>The joining link for your registered event has been updated.</p>
                <p><strong>Joining Link:</strong></p>
                <a href="${joining_link}">${joining_link}</a>
                <br/><br/>
                <p>Regards,<br/>Rotaract Club of GHRUA</p>
                `
            );
        }

        res.json({ message: "Joining link updated and emails sent" });
    } catch (err) {
        console.error("Update joining link error:", err);
        res.status(500).json({ message: "Failed to update joining link" });
    }
};

/**
 * ASST_ADMIN / ADMIN
 * Mark Event Completed
 * No Email
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
