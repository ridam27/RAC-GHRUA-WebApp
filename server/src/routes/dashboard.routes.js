const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const { memberDashboard } = require("../controllers/dashboard.controller");

router.get("/member", verifyToken(), memberDashboard);

module.exports = router;
