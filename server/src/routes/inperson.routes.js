const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const {
    createInPersonEvent,
    getInPersonEvents,
    deleteInPersonEvent,
    createMeeting,
    getMeetings,
    deleteMeeting
} = require("../controllers/inperson.controller");

/* ================= IN-PERSON EVENTS ================= */

router.get(
    "/inpevents",
    verifyToken(),
    getInPersonEvents
);

router.post(
    "/inpevents",
    verifyToken(["ADMIN", "ASST_ADMIN"]),
    createInPersonEvent
);

router.delete(
    "/inpevents/:id",
    verifyToken(["ADMIN", "ASST_ADMIN"]),
    deleteInPersonEvent
);

/* ================= MEETINGS ================= */

router.get(
    "/meetings",
    verifyToken(),
    getMeetings
);

router.post(
    "/meetings",
    verifyToken(["ADMIN", "ASST_ADMIN"]),
    createMeeting
);

router.delete(
    "/meetings/:id",
    verifyToken(["ADMIN", "ASST_ADMIN"]),
    deleteMeeting
);

module.exports = router;
