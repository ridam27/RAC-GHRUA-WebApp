const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const {
    getProfile,
    updateProfile
} = require("../controllers/profile.controller");

router.get("/", verifyToken(), getProfile);
router.put("/", verifyToken(), updateProfile);

module.exports = router;
