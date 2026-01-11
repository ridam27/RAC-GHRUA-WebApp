import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, roles = [] }) {
    const { user } = useAuth();

    // ❌ Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // ❌ Role not allowed
    if (roles.length && !roles.includes(user.system_role)) {
        return <Navigate to="/login" replace />;
    }

    // ✅ Allowed
    return children;
}
