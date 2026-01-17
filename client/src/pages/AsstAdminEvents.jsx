import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function AsstAdminEvents() {
    const [events, setEvents] = useState([]);
    const [links, setLinks] = useState({});
    const [loadingId, setLoadingId] = useState(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        event_date: ""
    });

    const navigate = useNavigate();

    const loadEvents = async () => {
        const res = await api.get("/events");
        setEvents(res.data);
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const createEvent = async () => {
        if (!form.title || !form.event_date) {
            return toast.error("Title and date required");
        }

        try {
            await api.post("/events", form);
            toast.success("Event created");
            setForm({ title: "", description: "", event_date: "" });
            loadEvents();
        } catch {
            toast.error("Failed to create event");
        }
    };

    const updateLink = async (id, joining_link) => {
        if (!joining_link || joining_link.trim() === "") {
            return toast.error("Joining link required");
        }

        try {
            setLoadingId(id);

            await api.put(`/events/${id}/link`, { joining_link });

            toast.success("Joining link updated");
            setLinks((prev) => ({ ...prev, [id]: joining_link }));
            loadEvents();
        } catch {
            toast.error("Failed to update link");
        } finally {
            setLoadingId(null);
        }
    };

    const completeEvent = async (id) => {
        try {
            setLoadingId(id);

            await api.put(`/events/${id}/complete`);

            toast.success("Event marked as completed");
            loadEvents();
        } catch {
            toast.error("Failed to complete event");
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <>
            <Navbar />
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Manage Events</h2>

                {/* CREATE EVENT */}
                <div className="bg-white p-4 rounded shadow mb-6">
                    <h3 className="font-semibold mb-3">Create Event</h3>

                    <input
                        placeholder="Title"
                        className="border p-2 w-full mb-2"
                        value={form.title}
                        onChange={(e) =>
                            setForm({ ...form, title: e.target.value })
                        }
                    />

                    <textarea
                        placeholder="Description"
                        className="border p-2 w-full mb-2"
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                    />

                    <input
                        type="date"
                        className="border p-2 w-full mb-3"
                        value={form.event_date}
                        onChange={(e) =>
                            setForm({ ...form, event_date: e.target.value })
                        }
                    />

                    <button
                        onClick={createEvent}
                        className="bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        Create Event
                    </button>
                </div>

                {/* EXISTING EVENTS */}
                <h3 className="font-semibold mb-3">Existing Events</h3>

                <div className="space-y-4">
                    {events.map((e) => {
                        const currentLink =
                            links[e.id] ?? e.joining_link ?? "";

                        return (
                            <div
                                key={e.id}
                                className="bg-gray-100 p-4 rounded space-y-3"
                            >
                                {/* HEADER */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-semibold">{e.title}</div>
                                        <div className="text-sm text-gray-500">
                                            {e.date}
                                        </div>
                                    </div>

                                    <span
                                        className={`text-xs px-2 py-1 rounded ${e.is_completed
                                            ? "bg-green-600 text-white"
                                            : "bg-yellow-400 text-black"
                                            }`}
                                    >
                                        {e.is_completed ? "Completed" : "Upcoming"}
                                    </span>
                                </div>

                                {/* JOINING LINK */}
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Joining link"
                                        value={currentLink}
                                        onChange={(ev) =>
                                            setLinks((prev) => ({
                                                ...prev,
                                                [e.id]: ev.target.value
                                            }))
                                        }
                                        className="border p-2 w-full"
                                        disabled={e.is_completed || loadingId === e.id}
                                    />

                                    {!e.is_completed && (
                                        <button
                                            onClick={() =>
                                                updateLink(e.id, currentLink)
                                            }
                                            disabled={loadingId === e.id}
                                            className={`px-3 py-2 rounded text-sm text-white ${loadingId === e.id
                                                ? "bg-gray-400"
                                                : "bg-blue-600"
                                                }`}
                                        >
                                            {loadingId === e.id
                                                ? "Updating..."
                                                : "Update Link"}
                                        </button>
                                    )}
                                </div>

                                {/* ACTIONS */}
                                <div className="flex justify-between items-center">
                                    <button
                                        onClick={() => navigate(`/asst-admin/events/${e.id}`)}
                                        className="
                                        inline-flex items-center gap-2
                                        px-4 py-2
                                        rounded-xl
                                        text-sm font-medium
                                        text-white
                                        bg-linear-to-r from-emerald-500 to-blue-600
                                        shadow-md
                                        hover:from-emerald-600 hover:to-blue-700
                                        hover:shadow-lg
                                        transition-all duration-200
                                        focus:outline-none focus:ring-2 focus:ring-emerald-400
                                    "
                                    >
                                        Manage Attendance
                                    </button>



                                    {!e.is_completed && (
                                        <button
                                            onClick={() => completeEvent(e.id)}
                                            disabled={loadingId === e.id}
                                            className={`px-3 py-1 rounded text-sm text-white ${loadingId === e.id
                                                ? "bg-gray-400"
                                                : "bg-red-600"
                                                }`}
                                        >
                                            {loadingId === e.id
                                                ? "Processing..."
                                                : "Mark Completed"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
