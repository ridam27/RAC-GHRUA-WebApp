const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");

const {
  memberDashboard,
  asstAdminDashboard,
  adminDashboard
} = require("../controllers/dashboard.controller");

router.get("/member", verifyToken(), memberDashboard);
router.get("/asst-admin", verifyToken(["ASST_ADMIN", "ADMIN"]), asstAdminDashboard);
router.get("/admin", verifyToken(["ADMIN"]), adminDashboard);

module.exports = router;
