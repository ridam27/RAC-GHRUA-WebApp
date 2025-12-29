const pool = require("../config/db");
const ExcelJS = require("exceljs");

/**
 * Get event history (with optional date filter)
 */
exports.getEventHistory = async (req, res) => {
    const { from, to } = req.query;

    let query = `
        SELECT
            id,
            title,
            event_date::text AS event_date,
            certificate_status
        FROM events
        WHERE 1=1
    `;

    const values = [];

    if (from) {
        values.push(from);
        query += ` AND event_date >= $${values.length}`;
    }

    if (to) {
        values.push(to);
        query += ` AND event_date <= $${values.length}`;
    }

    query += " ORDER BY event_date DESC";

    const result = await pool.query(query, values);
    res.json(result.rows);
};

/**
 * Export event history to Excel
 */
exports.exportEventHistory = async (req, res) => {
    const { from, to } = req.query;

    let query = `
        SELECT
            title,
            event_date::text AS event_date,
            certificate_status
        FROM events
        WHERE 1=1
    `;

    const values = [];

    if (from) {
        values.push(from);
        query += ` AND event_date >= $${values.length}`;
    }

    if (to) {
        values.push(to);
        query += ` AND event_date <= $${values.length}`;
    }

    query += " ORDER BY event_date DESC";

    const result = await pool.query(query, values);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Event History");

    sheet.columns = [
        { header: "Sr. No.", key: "sr", width: 8 },
        { header: "Event Date", key: "event_date", width: 15 },
        { header: "Event Name", key: "title", width: 30 },
        { header: "Certificate Status", key: "certificate_status", width: 20 }
    ];

    result.rows.forEach((row, index) => {
        sheet.addRow({
            sr: index + 1,
            event_date: row.event_date,
            title: row.title,
            certificate_status: row.certificate_status
        });
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=event_history.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
};

/**
 * Update certificate status (ADMIN / ASST_ADMIN)
 */
exports.updateCertificateStatus = async (req, res) => {
    const { eventId } = req.params;
    const { certificate_status } = req.body;

    if (!["RECEIVED", "NOT_RECEIVED"].includes(certificate_status)) {
        return res.status(400).json({ message: "Invalid certificate status" });
    }

    await pool.query(
        `UPDATE events
         SET certificate_status = $1
         WHERE id = $2`,
        [certificate_status, eventId]
    );

    res.json({ message: "Certificate status updated successfully" });
};
