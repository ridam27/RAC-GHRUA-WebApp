const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const controller = require("../controllers/attendance.controller");

router.get("/:eventId", verifyToken(["ADMIN", "ASST_ADMIN"]), controller.getRegisteredUsers);
router.post("/:eventId/mark", verifyToken(["ADMIN", "ASST_ADMIN"]), controller.markPresent);

module.exports = router;
