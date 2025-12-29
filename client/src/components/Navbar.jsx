import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
            <div className="font-semibold">
                Rotaract Club of GHRUA
            </div>

            <div className="flex items-center gap-6 text-sm">
                <Link to="/dashboard" className="hover:underline">
                    Dashboard
                </Link>

                <Link to="/events" className="hover:underline">
                    Events
                </Link>

                {user?.system_role === "ASST_ADMIN" && (
                    <Link to="/asst-admin" className="hover:underline">
                        Manage Events
                    </Link>
                )}

                {user?.system_role === "ADMIN" && (
                    <Link to="/admin/users" className="hover:underline">
                        Admin Panel
                    </Link>
                )}

                <Link to="/profile" className="hover:underline">
                        {user?.name} | {user?.system_role}
                </Link>

                <span
                    className={`text-xs px-2 py-1 rounded ${user?.club_fee_status === "PAID"
                        ? "bg-green-500"
                        : user?.club_fee_status === "PARTIAL"
                            ? "bg-yellow-400 text-black"
                            : "bg-red-500"
                        }`}
                >
                    {user?.club_fee_status}
                </span>

                <button
                    onClick={handleLogout}
                    className="bg-white text-blue-600 px-3 py-1 rounded"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}
