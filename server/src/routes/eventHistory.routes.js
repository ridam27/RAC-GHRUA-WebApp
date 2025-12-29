const router = require("express").Router();
const { verifyToken } = require("../middlewares/auth.middleware");
const {
    getEventHistory,
    exportEventHistory,
    updateCertificateStatus
} = require("../controllers/eventHistory.controller");

router.get(
    "/",
    verifyToken(["ADMIN", "ASST_ADMIN"]),
    getEventHistory
);

router.get(
    "/export",
    verifyToken(["ADMIN", "ASST_ADMIN"]),
    exportEventHistory
);

router.put(
    "/:eventId/certificate",
    verifyToken(["ADMIN", "ASST_ADMIN"]),
    updateCertificateStatus
);



module.exports = router;
