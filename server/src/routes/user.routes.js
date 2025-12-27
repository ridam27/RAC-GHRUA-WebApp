const router = require("express").Router();
const {
    createUser,
    getAllUsers,
    updateFeeStatus
} = require("../controllers/user.controller");

const { verifyToken } = require("../middlewares/auth.middleware");

/**
 * ADMIN only
 */
router.post("/", verifyToken(["ADMIN"]), createUser);

/**
 * ADMIN & ASST_ADMIN
 */
router.get("/", verifyToken(["ADMIN", "ASST_ADMIN"]), getAllUsers);

/**
 * ADMIN only
 */
router.put(
    "/:userId/fee",
    verifyToken(["ADMIN"]),
    updateFeeStatus
);

module.exports = router;
