const router = require("express").Router();
const { signup } = require("../controllers/signup.controller");
const { login } = require("../controllers/auth.controller");

router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
