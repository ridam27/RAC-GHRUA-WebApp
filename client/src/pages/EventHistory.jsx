import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; // 🔹 ADDED

export default function EventHistory() {
    const [events, setEvents] = useState([]);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [savingId, setSavingId] = useState(null);

    const navigate = useNavigate(); // 🔹 ADDED

    const loadEvents = async () => {
        try {
            const res = await api.get("/event-history", {
                params: { from, to }
            });
            setEvents(res.data);
        } catch {
            toast.error("Failed to load events");
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const applyFilter = () => {
        loadEvents();
    };

    const exportExcel = async () => {
        try {
            const res = await api.get("/event-history/export", {
                params: { from, to },
                responseType: "blob"
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = "event_history.xlsx";
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch {
            toast.error("Failed to export Excel");
        }
    };

    const toggleCertificate = (id) => {
        setEvents((prev) =>
            prev.map((e) =>
                e.id === id
                    ? {
                        ...e,
                        certificate_status:
                            e.certificate_status === "RECEIVED"
                                ? "NOT_RECEIVED"
                                : "RECEIVED"
                    }
                    : e
            )
        );
    };

    const saveCertificateStatus = async (id, status) => {
        try {
            setSavingId(id);
            await api.put(`/event-history/${id}/certificate`, {
                certificate_status: status
            });
            toast.success("Certificate status updated");
        } catch {
            toast.error("Failed to update status");
        } finally {
            setSavingId(null);
        }
    };

    return (
        <>
            <Navbar />

            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Event History</h2>

                {/* 🔹 FILTERS + MEMBER STATS BUTTON ROW */}
                <div className="flex items-center gap-4 mb-4">
                    {/* Filters */}
                    <input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="border p-2 rounded"
                    />
                    <input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="border p-2 rounded"
                    />
                    <button
                        onClick={applyFilter}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Apply
                    </button>
                    <button
                        onClick={exportExcel}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Export Excel
                    </button>

                    {/* 🔹 PUSH BUTTON TO EXTREME RIGHT */}
                    <div className="ml-auto">
                        <button
                            onClick={() => navigate("/user-stats")}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
                        >
                            Member Stats
                        </button>
                    </div>
                </div>

                {/* Table */}
                <table className="w-full bg-white rounded shadow text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Sr. No.</th>
                            <th className="p-2">Event Date</th>
                            <th className="p-2">Event Name</th>
                            <th className="p-2">Status</th>
                            <th className="p-2">Certificate</th>
                            <th className="p-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {events.map((e, i) => (
                            <tr key={e.id} className="border-b text-center">
                                <td className="p-2">{i + 1}</td>
                                <td className="p-2">{e.event_date}</td>
                                <td className="p-2">{e.title}</td>

                                <td className="p-2">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${
                                            e.status === "COMPLETED"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                        }`}
                                    >
                                        {e.status}
                                    </span>
                                </td>

                                <td className="p-2">
                                    <button
                                        onClick={() => toggleCertificate(e.id)}
                                        className={`px-3 py-1 rounded text-xs text-white ${
                                            e.certificate_status === "RECEIVED"
                                                ? "bg-green-600"
                                                : "bg-red-600"
                                        }`}
                                    >
                                        {e.certificate_status}
                                    </button>
                                </td>

                                <td className="p-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            saveCertificateStatus(
                                                e.id,
                                                e.certificate_status
                                            )
                                        }
                                        disabled={savingId === e.id}
                                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                    >
                                        {savingId === e.id ? "Saving..." : "Save"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {events.length === 0 && (
                    <div className="text-gray-500 mt-4">No events found</div>
                )}
            </div>
        </>
    );
}
