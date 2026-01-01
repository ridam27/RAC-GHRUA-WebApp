const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

const allowedOrigins = [
    "http://localhost:5173",
    "https://racghrua.vercel.app"
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
    res.send("RAC GHRUA Backend Running 🚀");
});

module.exports = app;

const eventRoutes = require("./routes/event.routes");
const registrationRoutes = require("./routes/registration.routes");
const attendanceRoutes = require("./routes/attendance.routes");

app.use("/api/events", eventRoutes);
app.use("/api/registrations", registrationRoutes);
app.use("/api/attendance", attendanceRoutes);

const dashboardRoutes = require("./routes/dashboard.routes");
app.use("/api/dashboard", dashboardRoutes);

const exportRoutes = require("./routes/export.routes");
app.use("/api/export", exportRoutes);

const adminUsersRoutes = require("./routes/admin.users.routes");
app.use("/api/admin", adminUsersRoutes);

const profileRoutes = require("./routes/profile.routes");
app.use("/api/profile", profileRoutes);

const eventHistoryRoutes = require("./routes/eventHistory.routes");
app.use("/api/event-history", eventHistoryRoutes);
