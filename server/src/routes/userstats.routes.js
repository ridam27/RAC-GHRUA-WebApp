const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const { getUserAttendanceStats, exportUserAttendanceStats } = require("../controllers/userstats.controller");

/**
 * GET /stats/users
 * ADMIN & ASST_ADMIN only
 */

router.get(
    "/",
    verifyToken(["ADMIN", "ASST_ADMIN"]),
    getUserAttendanceStats
);
router.get(
    "/export",
    verifyToken(["ADMIN", "ASST_ADMIN"]),
    exportUserAttendanceStats
);

module.exports = router;
