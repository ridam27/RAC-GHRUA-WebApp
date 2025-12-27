const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const { exportAttendance } = require("../controllers/export.controller");

router.get(
    "/attendance/:eventId",
    verifyToken(["ADMIN", "ASST_ADMIN"]),
    exportAttendance
);

module.exports = router;
