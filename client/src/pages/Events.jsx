import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getEvents, registerIn, registerOut } from "../api/event.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Events() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    const loadEvents = async () => {
        const res = await getEvents();
        setEvents(res.data);
    };

    useEffect(() => {
        loadEvents();
    }, []);

    const formatDate = (date) => {
        if (!date) return "";
        const d = new Date(date);
        return d.toLocaleDateString("en-GB"); // DD/MM/YYYY
    };

    return (
        <>
            <Navbar />

            <div className="p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4">
                    Upcoming Events
                </h2>

                <div className="grid gap-4">
                    {events.map((e) => (
                        <div
                            key={e.id}
                            className="bg-white p-4 rounded-xl shadow flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                        >
                            {/* 🔹 EVENT INFO */}
                            <div
                                onClick={() => navigate(`/events/${e.id}`)}
                                className="cursor-pointer space-y-1"
                            >
                                <h3 className="font-semibold flex flex-wrap items-center gap-2">
                                    {e.title}

                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full ${
                                            e.is_registered
                                                ? "bg-green-100 text-green-700"
                                                : "bg-gray-200 text-gray-700"
                                        }`}
                                    >
                                        {e.is_registered
                                            ? "Registered"
                                            : "Not Registered"}
                                    </span>
                                </h3>

                                <p className="text-sm text-gray-500">
                                    Event Date: {formatDate(e.event_date)}
                                </p>
                            </div>

                            {/* 🔹 ACTION BUTTONS */}
                            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                                <button
                                    disabled={e.is_registered}
                                    onClick={async () => {
                                        await registerIn(e.id);
                                        toast.success("Registered");
                                        loadEvents();
                                    }}
                                    className={`px-4 py-2 rounded-lg text-white text-sm w-full sm:w-auto transition ${
                                        e.is_registered
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-green-600 hover:bg-green-700"
                                    }`}
                                >
                                    I’m In
                                </button>

                                <button
                                    disabled={!e.is_registered}
                                    onClick={async () => {
                                        await registerOut(e.id);
                                        toast.success("Unregistered");
                                        loadEvents();
                                    }}
                                    className={`px-4 py-2 rounded-lg text-white text-sm w-full sm:w-auto transition ${
                                        !e.is_registered
                                            ? "bg-gray-400 cursor-not-allowed"
                                            : "bg-red-600 hover:bg-red-700"
                                    }`}
                                >
                                    I’m Out
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {events.length === 0 && (
                    <div className="text-gray-500 mt-6 text-sm">
                        No upcoming events
                    </div>
                )}
            </div>
        </>
    );
}
