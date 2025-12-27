const ExcelJS = require("exceljs");
const pool = require("../config/db");

exports.exportAttendance = async (req, res) => {
    const { eventId } = req.params;

    const result = await pool.query(
        `SELECT u.name, u.email, a.present
     FROM attendance a
     JOIN users u ON u.id = a.user_id
     WHERE a.event_id=$1`,
        [eventId]
    );

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Attendance");

    sheet.columns = [
        { header: "Name", key: "name" },
        { header: "Email", key: "email" },
        { header: "Present", key: "present" }
    ];

    result.rows.forEach(row => {
        sheet.addRow({
            name: row.name,
            email: row.email,
            present: row.present ? "Yes" : "No"
        });
    });

    res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
        "Content-Disposition",
        "attachment; filename=attendance.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
};
