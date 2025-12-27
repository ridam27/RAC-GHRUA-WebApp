const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const controller = require("../controllers/registration.controller");

router.post("/:eventId/in", verifyToken(), controller.registerEvent);
router.delete("/:eventId/out", verifyToken(), controller.unregisterEvent);

module.exports = router;
