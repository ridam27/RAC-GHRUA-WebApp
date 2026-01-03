const pool = require("../config/db");
const ExcelJS = require("exceljs");

/**
 * ADMIN / ASST_ADMIN
 * GET /api/stats
 * Optional query params: from, to
 */
exports.getUserAttendanceStats = async (req, res) => {
    try {
        const { from, to } = req.query;

        let params = [];
        let dateFilter = "";

        if (from && to) {
            params.push(from, to);
            dateFilter = `AND a.marked_at::date BETWEEN $1 AND $2`;
        }

        const query = `
            SELECT
                u.id AS user_id,
                u.name,
                u.club_role,

                COUNT(DISTINCT r.event_id) AS total_registered,

                COUNT(DISTINCT a.event_id)
                FILTER (WHERE a.present = true ${dateFilter}) AS attended,

                COUNT(DISTINCT r.event_id)
                - COUNT(DISTINCT a.event_id)
                FILTER (WHERE a.present = true ${dateFilter}) AS missed,

                CASE
                    WHEN COUNT(DISTINCT r.event_id) = 0 THEN 0
                    ELSE ROUND(
                        (
                            COUNT(DISTINCT a.event_id)
                            FILTER (WHERE a.present = true ${dateFilter})::numeric
                            / COUNT(DISTINCT r.event_id)
                        ) * 100
                    )
                END AS attendance_percentage

            FROM users u
            LEFT JOIN registrations r ON r.user_id = u.id
            LEFT JOIN attendance a ON a.user_id = u.id AND a.event_id = r.event_id

            WHERE u.system_role = 'MEMBER'
            GROUP BY u.id
            ORDER BY u.name ASC
        `;

        const result = await pool.query(query, params);
        res.status(200).json(result.rows);

    } catch (err) {
        console.error("User attendance stats error:", err);
        res.status(500).json({ message: "Failed to fetch user attendance statistics" });
    }
};

/**
 * ADMIN / ASST_ADMIN
 * GET /api/stats/export
 * Optional query params: from, to
 */
exports.exportUserAttendanceStats = async (req, res) => {
    try {
        const { from, to } = req.query;

        let params = [];
        let dateFilter = "";

        if (from && to) {
            params.push(from, to);
            dateFilter = `AND a.marked_at::date BETWEEN $1 AND $2`;
        }

        const query = `
            SELECT
                u.name,
                u.club_role,
                COUNT(DISTINCT r.event_id) AS total_registered,
                COUNT(DISTINCT a.event_id)
                FILTER (WHERE a.present = true ${dateFilter}) AS attended,
                COUNT(DISTINCT r.event_id)
                - COUNT(DISTINCT a.event_id)
                FILTER (WHERE a.present = true ${dateFilter}) AS missed,
                CASE
                    WHEN COUNT(DISTINCT r.event_id) = 0 THEN 0
                    ELSE ROUND(
                        (
                            COUNT(DISTINCT a.event_id)
                            FILTER (WHERE a.present = true ${dateFilter})::numeric
                            / COUNT(DISTINCT r.event_id)
                        ) * 100
                    )
                END AS attendance_percentage
            FROM users u
            LEFT JOIN registrations r ON r.user_id = u.id
            LEFT JOIN attendance a ON a.user_id = u.id AND a.event_id = r.event_id
            WHERE u.system_role = 'MEMBER'
            GROUP BY u.id
            ORDER BY u.name ASC
        `;

        const { rows } = await pool.query(query, params);

        // 🟢 Create Excel
        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet("User Attendance Stats");

        sheet.columns = [
            { header: "Sr. No.", key: "sr", width: 10 },
            { header: "Name", key: "name", width: 25 },
            { header: "Club Role", key: "club_role", width: 20 },
            { header: "Registered", key: "total_registered", width: 15 },
            { header: "Attended", key: "attended", width: 15 },
            { header: "Missed", key: "missed", width: 15 },
            { header: "Attendance %", key: "attendance_percentage", width: 18 }
        ];

        rows.forEach((row, index) => {
            sheet.addRow({
                sr: index + 1,
                ...row
            });
        });

        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=user_attendance_stats.xlsx"
        );

        await workbook.xlsx.write(res);
        res.end();

    } catch (err) {
        console.error("Export stats error:", err);
        res.status(500).json({ message: "Failed to export user stats" });
    }
};
