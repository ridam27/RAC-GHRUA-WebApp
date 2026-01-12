import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import {
    Menu,
    X,
    UserCircle,
    LayoutDashboard,
    Calendar,
    History,
    Settings,
    Users,
    MapPin
} from "lucide-react";

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        window.location.href = "/login";
    };

    const closeMobileMenu = () => setMenuOpen(false);

    const desktopLink =
        "transition-all duration-200 ease-in-out hover:scale-105 hover:font-semibold";

    const mobileLink =
        "flex items-center gap-4 px-6 py-4 rounded-xl text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition";

    return (
        <>
            {/* ================= DESKTOP NAVBAR ================= */}
            <nav className="hidden md:flex fixed top-4 left-6 right-6 z-50 bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-lg justify-between items-center">
                <Link
                    to="/login"
                    className="font-semibold text-lg"
                >
                    Rotaract Club of GHRUA
                </Link>

                <div className="flex items-center gap-6 text-sm relative">
                    <Link to="/dashboard" className={desktopLink}>Dashboard</Link>
                    <Link to="/events" className={desktopLink}>Online Events</Link>

                    {["ADMIN", "ASST_ADMIN"].includes(user?.system_role) && (
                        <Link to="/event-history" className={desktopLink}>Event History</Link>
                    )}

                    {["ADMIN", "ASST_ADMIN"].includes(user?.system_role) && (
                        <Link to="/inp-events" className={desktopLink}>InPerson Events</Link>
                    )}

                    {["ADMIN", "ASST_ADMIN"].includes(user?.system_role) && (
                        <Link to="/meetings" className={desktopLink}>Manage Meetings</Link>
                    )}

                    {user?.system_role === "ASST_ADMIN" && (
                        <Link to="/asst-admin" className={desktopLink}>Manage MD Events</Link>
                    )}

                    {user?.system_role === "ADMIN" && (
                        <Link to="/admin/users" className={desktopLink}>Admin Panel</Link>
                    )}

                    {/* PROFILE */}
                    <div className="relative">
                        <button onClick={() => setProfileOpen(!profileOpen)}>
                            <UserCircle size={32} />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-xl shadow-lg overflow-hidden">
                                <Link
                                    to="/profile"
                                    onClick={() => setProfileOpen(false)}
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* ================= MOBILE NAVBAR ================= */}
            <nav className="md:hidden fixed top-0 left-0 right-0 z-50 bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
                <Link
                    to="/login"
                    className="font-semibold text-lg"
                >
                    RAC GHRUA
                </Link>

                <div className="flex items-center gap-3">
                    <div className="relative">
                        <button onClick={() => setProfileOpen(!profileOpen)}>
                            <UserCircle size={28} />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 mt-2 w-36 bg-white text-black rounded-xl shadow-lg overflow-hidden">
                                <Link
                                    to="/profile"
                                    onClick={() => setProfileOpen(false)}
                                    className="block px-4 py-2 hover:bg-gray-100"
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    <button onClick={() => setMenuOpen(true)}>
                        <Menu size={26} />
                    </button>
                </div>
            </nav>

            {/* ================= BACKDROP ================= */}
            {menuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/40 z-40"
                    onClick={closeMobileMenu}
                />
            )}

            {/* ================= SLIDING MOBILE MENU ================= */}
            <div
                className={`md:hidden fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                {/* HEADER */}
                <div className="flex justify-between items-center px-6 py-5 bg-blue-600 text-white">
                    <span className="text-lg font-semibold">Menu</span>
                    <button onClick={closeMobileMenu}>
                        <X size={24} />
                    </button>
                </div>

                {/* LINKS */}
                <div className="flex flex-col gap-1 mt-4 px-2 pb-24">
                    <Link to="/dashboard" className={mobileLink} onClick={closeMobileMenu}>
                        <LayoutDashboard size={22} /> Dashboard
                    </Link>

                    <Link to="/events" className={mobileLink} onClick={closeMobileMenu}>
                        <Calendar size={22} />Online Events
                    </Link>

                    {["ADMIN", "ASST_ADMIN"].includes(user?.system_role) && (
                        <Link to="/event-history" className={mobileLink} onClick={closeMobileMenu}>
                            <History size={22} /> Event History
                        </Link>
                    )}

                    {["ADMIN", "ASST_ADMIN"].includes(user?.system_role) && (
                        <Link to="/inp-events" className={mobileLink} onClick={closeMobileMenu}>
                            <MapPin size={22} />InPerson Events
                        </Link>
                    )}

                    {["ADMIN", "ASST_ADMIN"].includes(user?.system_role) && (
                        <Link to="/meetings" className={mobileLink} onClick={closeMobileMenu}>
                            <Users size={22} />Manage Meetings
                        </Link>
                    )}

                    {user?.system_role === "ASST_ADMIN" && (
                        <Link to="/asst-admin" className={mobileLink} onClick={closeMobileMenu}>
                            <Settings size={22} /> Manage MD Events
                        </Link>
                    )}

                    {user?.system_role === "ADMIN" && (
                        <Link to="/admin/users" className={mobileLink} onClick={closeMobileMenu}>
                            <Users size={22} /> Admin Panel
                        </Link>
                    )}
                </div>

                {/* FOOTER CREDIT */}
                <div className="absolute bottom-10 left-4 right-4 bg-gray-50 rounded-full px-4 py-2 shadow text-center">
                    <p className="text-xs text-gray-600">
                        Crafted with ❤️ by{" "}
                        <a
                            href="https://instagram.com/ridam_27"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-red-800 hover:text-red-600 transition"
                        >
                            Ridam Satkar
                        </a>
                    </p>
                </div>
            </div>

            {/* ================= SPACER ================= */}
            <div className="h-20 md:h-20"></div>
        </>
    );
}
