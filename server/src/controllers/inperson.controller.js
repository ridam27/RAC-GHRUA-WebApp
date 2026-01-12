const pool = require("../config/db");

/* ===================== IN-PERSON EVENTS ===================== */

exports.createInPersonEvent = async (req, res) => {
    const { event_name, event_date, start_time } = req.body;

    await pool.query(
        `
        INSERT INTO inperson_events
        (event_name, event_date, start_time, created_by)
        VALUES ($1,$2,$3,$4)
        `,
        [event_name, event_date, start_time, req.user.id]
    );

    res.json({ message: "In-person event created" });
};

exports.getInPersonEvents = async (req, res) => {
    const result = await pool.query(
        `
        SELECT e.*, u.name AS created_by_name
        FROM inperson_events e
        LEFT JOIN users u ON u.id = e.created_by
        ORDER BY event_date DESC
        `
    );

    res.json(result.rows);
};

exports.deleteInPersonEvent = async (req, res) => {
    await pool.query(
        "DELETE FROM inperson_events WHERE id=$1",
        [req.params.id]
    );

    res.json({ message: "Event deleted" });
};

/* ===================== MEETINGS ===================== */

exports.createMeeting = async (req, res) => {
    const { title, meeting_date, start_time } = req.body;

    await pool.query(
        `
        INSERT INTO meetings
        (title, meeting_date, start_time, created_by)
        VALUES ($1,$2,$3,$4)
        `,
        [title, meeting_date, start_time, req.user.id]
    );

    res.json({ message: "Meeting created" });
};

exports.getMeetings = async (req, res) => {
    const result = await pool.query(
        `
        SELECT m.*, u.name AS created_by_name
        FROM meetings m
        LEFT JOIN users u ON u.id = m.created_by
        ORDER BY meeting_date DESC
        `
    );

    res.json(result.rows);
};

exports.deleteMeeting = async (req, res) => {
    await pool.query(
        "DELETE FROM meetings WHERE id=$1",
        [req.params.id]
    );

    res.json({ message: "Meeting deleted" });
};
