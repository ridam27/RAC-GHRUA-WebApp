import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function EventHistory() {
    const [events, setEvents] = useState([]);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [savingId, setSavingId] = useState(null);

    const navigate = useNavigate();

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
            link.click();
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

            <div className="p-4 md:p-6">
                {/* 🔹 HEADING ROW */}
                <div className="flex items-center mb-4">
                    <h2 className="text-xl md:text-2xl font-semibold">
                        Event History
                    </h2>

                    {/* 🔹 MOBILE MEMBER STATS (ONLY MOBILE) */}
                    <button
                        onClick={() => navigate("/user-stats")}
                        className="ml-auto md:hidden bg-indigo-600 text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:bg-indigo-700 transition"
                    >
                        Member Stats
                    </button>
                </div>

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
                            onClick={loadEvents}
                            className="bg-blue-600 text-white px-4 py-2 rounded w-full sm:w-auto"
                        >
                            Apply
                        </button>
                        <button
                            onClick={exportExcel}
                            className="bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto"
                        >
                            Export Excel
                        </button>
                    </div>

                    {/* 🔹 DESKTOP MEMBER STATS */}
                    <button
                        onClick={() => navigate("/user-stats")}
                        className="hidden md:block md:ml-auto bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
                    >
                        Member Stats
                    </button>
                </div>

                {/* 🔹 TABLE */}
                <div className="overflow-x-auto bg-white rounded shadow">
                    <table className="min-w-\[700px] w-full text-sm">
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
                                            onClick={() =>
                                                toggleCertificate(e.id)
                                            }
                                            className={`px-3 py-1 rounded text-xs text-white ${
                                                e.certificate_status ===
                                                "RECEIVED"
                                                    ? "bg-green-600"
                                                    : "bg-red-600"
                                            }`}
                                        >
                                            {e.certificate_status}
                                        </button>
                                    </td>

                                    <td className="p-2">
                                        <button
                                            onClick={() =>
                                                saveCertificateStatus(
                                                    e.id,
                                                    e.certificate_status
                                                )
                                            }
                                            disabled={savingId === e.id}
                                            className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                                        >
                                            {savingId === e.id
                                                ? "Saving..."
                                                : "Save"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {events.length === 0 && (
                    <div className="text-gray-500 mt-4 text-sm">
                        No events found
                    </div>
                )}
            </div>
        </>
    );
}
