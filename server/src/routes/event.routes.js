const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const controller = require("../controllers/event.controller");

router.post("/", verifyToken(["ADMIN", "ASST_ADMIN"]), controller.createEvent);
router.get("/", verifyToken(), controller.getUpcomingEvents);
router.get("/:eventId", verifyToken(), controller.getEventById);
router.put("/:eventId/link", verifyToken(["ADMIN", "ASST_ADMIN"]), controller.updateJoiningLink);
router.put("/:eventId/complete", verifyToken(["ADMIN", "ASST_ADMIN"]), controller.completeEvent);

module.exports = router;
