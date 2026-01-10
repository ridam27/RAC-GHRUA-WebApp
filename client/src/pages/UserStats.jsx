import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function UserStats() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await api.get("/stats", {
                params: { from, to }
            });
            setUsers(res.data);
        } catch {
            toast.error("Failed to load user stats");
        } finally {
            setLoading(false);
        }
    };

    const exportExcel = async () => {
        try {
            const res = await api.get("/stats/export", {
                params: { from, to },
                responseType: "blob"
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = "user_attendance_stats.xlsx";
            link.click();
        } catch {
            toast.error("Failed to export Excel");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-gray-600">Loading stats...</p>
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <div className="p-4 md:p-6">
                {/* 🔹 HEADER */}
                <h2 className="text-xl md:text-2xl font-semibold mb-4">
                    User Attendance Statistics
                </h2>

                {/* 🔹 FILTERS */}
                <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="border p-2 rounded w-full sm:w-auto"
                        />
                        <input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="border p-2 rounded w-full sm:w-auto"
                        />
                        <button
                            onClick={fetchStats}
                            className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
                        >
                            Apply
                        </button>
                    </div>

                    <button
                        onClick={exportExcel}
                        className="md:ml-auto bg-green-600 text-white px-4 py-2 rounded w-full md:w-auto"
                    >
                        Export Excel
                    </button>
                </div>

                {/* 🔹 DESKTOP TABLE */}
                <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow">
                    <table className="min-w-full border-collapse text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-3 text-center">Sr. No.</th>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Club Role</th>
                                <th className="p-3 text-center">Registered</th>
                                <th className="p-3 text-center">Attended</th>
                                <th className="p-3 text-center">Missed</th>
                                <th className="p-3 text-center">Attendance %</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((u, i) => (
                                <tr
                                    key={u.user_id}
                                    className="border-t hover:bg-gray-50"
                                >
                                    <td className="p-3 text-center font-medium">{i + 1}</td>
                                    <td className="p-3">{u.name}</td>
                                    <td className="p-3 text-gray-600">{u.club_role}</td>
                                    <td className="p-3 text-center">{u.total_registered}</td>
                                    <td className="p-3 text-center text-green-600 font-semibold">
                                        {u.attended}
                                    </td>
                                    <td className="p-3 text-center text-red-600 font-semibold">
                                        {u.missed}
                                    </td>
                                    <td className="p-3 text-center">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                u.attendance_percentage >= 75
                                                    ? "bg-green-100 text-green-700"
                                                    : u.attendance_percentage >= 50
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {u.attendance_percentage}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* 🔹 MOBILE CARDS */}
                <div className="md:hidden grid gap-4">
                    {users.map((u, i) => (
                        <div
                            key={u.user_id}
                            className="bg-white rounded-xl shadow p-4 space-y-2"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">
                                    {i + 1}. {u.name}
                                </span>
                                <span
                                    className={`px-3 py-1 rounded-full text-xs ${
                                        u.attendance_percentage >= 75
                                            ? "bg-green-100 text-green-700"
                                            : u.attendance_percentage >= 50
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-red-100 text-red-700"
                                    }`}
                                >
                                    {u.attendance_percentage}%
                                </span>
                            </div>

                            <p className="text-sm text-gray-500">
                                Role: {u.club_role || "—"}
                            </p>

                            <div className="grid grid-cols-3 gap-2 text-center text-sm">
                                <div>
                                    <p className="text-gray-500">Registered</p>
                                    <p className="font-semibold">{u.total_registered}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Attended</p>
                                    <p className="font-semibold text-green-600">{u.attended}</p>
                                </div>
                                <div>
                                    <p className="text-gray-500">Missed</p>
                                    <p className="font-semibold text-red-600">{u.missed}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {users.length === 0 && (
                    <div className="text-gray-500 mt-6 text-sm text-center">
                        No data available
                    </div>
                )}
            </div>
        </>
    );
}
