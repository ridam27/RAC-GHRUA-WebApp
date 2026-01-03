import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function UserStats() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [from, setFrom] = useState(""); // ✅ date filter
    const [to, setTo] = useState("");     // ✅ date filter

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const res = await api.get("/stats", {
                params: { from, to } // ✅ send filters to backend
            });
            setUsers(res.data);
        } catch (err) {
            toast.error("Failed to load user stats");
        } finally {
            setLoading(false);
        }
    };

    const exportExcel = async () => { // ✅ Export button functionality
        try {
            const res = await api.get("/stats/export", {
                params: { from, to }, // ✅ apply filters in export
                responseType: "blob"
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = "user_attendance_stats.xlsx";
            document.body.appendChild(link);
            link.click();
            link.remove();
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

            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">
                    User Attendance Statistics
                </h2>

                {/* ✅ Filters & Export */}
                <div className="flex justify-between mb-4 gap-2">
                    <div className="flex gap-2">
                        <input
                            type="date"
                            value={from}
                            onChange={(e) => setFrom(e.target.value)}
                            className="border p-2 rounded"
                            placeholder="From"
                        />
                        <input
                            type="date"
                            value={to}
                            onChange={(e) => setTo(e.target.value)}
                            className="border p-2 rounded"
                            placeholder="To"
                        />
                        <button
                            onClick={fetchStats}
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                        >
                            Apply
                        </button>
                    </div>

                    <button
                        onClick={exportExcel}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Export Excel
                    </button>
                </div>

                <div className="overflow-x-auto bg-white rounded-xl shadow">
                    <table className="min-w-full border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                {/* ✅ SERIAL NUMBER */}
                                <th className="p-3 text-center text-sm font-semibold">Sr. No.</th>
                                <th className="p-3 text-left text-sm font-semibold">Name</th>
                                <th className="p-3 text-left text-sm font-semibold">Club Role</th>
                                <th className="p-3 text-center text-sm font-semibold">Registered</th>
                                <th className="p-3 text-center text-sm font-semibold">Attended</th>
                                <th className="p-3 text-center text-sm font-semibold">Missed</th>
                                <th className="p-3 text-center text-sm font-semibold">Attendance %</th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.map((u, index) => (
                                <tr
                                    key={u.user_id} // ✅ correct unique key
                                    className="border-t hover:bg-gray-50 transition"
                                >
                                    {/* ✅ SERIAL NUMBER */}
                                    <td className="p-3 text-center font-medium">{index + 1}</td>
                                    <td className="p-3">{u.name}</td>
                                    <td className="p-3 text-sm text-gray-600">{u.club_role}</td>
                                    <td className="p-3 text-center">{u.total_registered}</td>
                                    <td className="p-3 text-center text-green-600 font-medium">{u.attended}</td>
                                    <td className="p-3 text-center text-red-600 font-medium">{u.missed}</td>
                                    <td className="p-3 text-center font-semibold">
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

                            {users.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="7" // ✅ updated colSpan
                                        className="p-6 text-center text-gray-500"
                                    >
                                        No data available
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
