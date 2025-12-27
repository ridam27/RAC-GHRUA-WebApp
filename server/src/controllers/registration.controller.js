const pool = require("../config/db");

/**
 * MEMBER: I'm In
 */
exports.registerEvent = async (req, res) => {
    try {
        await pool.query(
            "INSERT INTO registrations (event_id, user_id) VALUES ($1,$2)",
            [req.params.eventId, req.user.id]
        );
        res.json({ message: "Registered successfully" });
    } catch {
        res.status(400).json({ message: "Already registered" });
    }
};

/**
 * MEMBER: I'm Out
 */
exports.unregisterEvent = async (req, res) => {
    await pool.query(
        "DELETE FROM registrations WHERE event_id=$1 AND user_id=$2",
        [req.params.eventId, req.user.id]
    );
    res.json({ message: "Unregistered successfully" });
};
