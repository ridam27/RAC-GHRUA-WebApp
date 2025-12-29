const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const {
    getAllUsers,
    updateUser
} = require("../controllers/admin.users.controller");

router.get(
    "/users",
    verifyToken(["ADMIN"]),
    getAllUsers
);

router.put(
    "/users/:id",
    verifyToken(["ADMIN"]),
    updateUser
);

module.exports = router;
