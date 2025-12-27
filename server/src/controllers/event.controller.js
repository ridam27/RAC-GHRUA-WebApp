const pool = require("../config/db");
const { sendEmail } = require("../utils/mailer");

/**
 * ASST_ADMIN / ADMIN: Create Event
 * Email: All MEMBERS
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

        // 📧 Notify all members
        const members = await pool.query(
            "SELECT email FROM users WHERE system_role='MEMBER'"
        );

        members.rows.forEach(member => {
            sendEmail(
                member.email,
                "New Rotaract Event Added",
                `<p><strong>${title}</strong> has been added.<br/>
                 Please login to the RAC GHRUA portal to view details.</p>`
            );
        });

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
 * ALL USERS: Event Details
 */
exports.getEventById = async (req, res) => {
    const result = await pool.query(
        "SELECT * FROM events WHERE id=$1",
        [req.params.eventId]
    );
    res.json(result.rows[0]);
};

/**
 * ASST_ADMIN / ADMIN: Upload / Update Joining Link
 * Email: REGISTERED (IN) USERS
 */
exports.updateJoiningLink = async (req, res) => {
    const { joining_link } = req.body;
    const { eventId } = req.params;

    try {
        // 1️⃣ Update event
        await pool.query(
            "UPDATE events SET joining_link = $1 WHERE id = $2",
            [joining_link, eventId]
        );

        // 2️⃣ Get emails of registered users
        const users = await pool.query(
            `
      SELECT u.email
      FROM registrations r
      JOIN users u ON u.id = r.user_id
      WHERE r.event_id = $1
      `,
            [eventId]
        );

        // 3️⃣ Send emails
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

        res.json({
            message: "Joining link updated and emails sent successfully"
        });

    } catch (err) {
        console.error("Joining link update error:", err);
        res.status(500).json({
            message: "Joining link updated, but email sending failed"
        });
    }
};

/**
 * ASST_ADMIN / ADMIN: Mark Event Complete
 * NO EMAIL
 */
exports.completeEvent = async (req, res) => {
    await pool.query(
        "UPDATE events SET status='COMPLETED' WHERE id=$1",
        [req.params.eventId]
    );
    res.json({ message: "Event marked as completed" });
};
