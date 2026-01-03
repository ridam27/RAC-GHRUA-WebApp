import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProtectedRoute from "../components/ProtectedRoute";
import MemberDashboard from "../pages/MemberDashboard";
import AsstAdminDashboard from "../pages/AsstAdminDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import Events from "../pages/Events";
import EventDetails from "../pages/EventDetails";
import AsstAdminEvents from "../pages/AsstAdminEvents";
import Attendance from "../pages/Attendance";
import AdminMembers from "../pages/AdminMembers";
import Profile from "../pages/Profile";
import EventHistory from "../pages/EventHistory";
import UserStats from "../pages/UserStats";



export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/signup" element={<Signup />} />

            <Route
                path="/dashboard/member"
                element={
                    <ProtectedRoute roles={["MEMBER"]}>
                        <MemberDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/asst-admin"
                element={
                    <ProtectedRoute roles={["ASST_ADMIN", "ADMIN"]}>
                        <AsstAdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/dashboard/admin"
                element={
                    <ProtectedRoute roles={["ADMIN"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            <Route path="*" element={<Navigate to="/login" />} />

            <Route
                path="/events"
                element={
                    <ProtectedRoute roles={["MEMBER", "ASST_ADMIN", "ADMIN"]}>
                        <Events />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/events/:id"
                element={
                    <ProtectedRoute roles={["MEMBER", "ASST_ADMIN", "ADMIN"]}>
                        <EventDetails />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/asst-admin"
                element={
                    <ProtectedRoute roles={["ASST_ADMIN", "ADMIN"]}>
                        <AsstAdminEvents />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/asst-admin/events/:id"
                element={
                    <ProtectedRoute roles={["ASST_ADMIN", "ADMIN"]}>
                        <Attendance />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/admin/users"
                element={
                    <ProtectedRoute roles={["ADMIN"]}>
                        <AdminMembers />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute roles={["MEMBER", "ASST_ADMIN", "ADMIN"]}>
                        <Profile />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/event-history"
                element={
                    <ProtectedRoute roles={["ADMIN", "ASST_ADMIN"]}>
                        <EventHistory />
                    </ProtectedRoute>
                }
            />
            
            <Route
                path="/user-stats"
                element={
                    <ProtectedRoute roles={["ADMIN", "ASST_ADMIN"]}>
                        <UserStats />
                    </ProtectedRoute>
                }
            />


        </Routes>
    );
}
