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

    return (
        <>
            <Navbar />

            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>

                <div className="grid gap-4">
                    {events.map((e) => (
                        <div
                            key={e.id}
                            className="bg-white p-4 rounded shadow flex justify-between items-center"
                        >
                            {/* Event Title + Status */}
                            <div
                                onClick={() => navigate(`/events/${e.id}`)}
                                className="cursor-pointer"
                            >
                                <h3 className="font-semibold flex items-center gap-2">
                                    {e.title}

                                    <span
                                        className={`text-xs px-2 py-0.5 rounded ${
                                            e.is_registered
                                                ? "bg-green-500 text-white"
                                                : "bg-gray-300 text-black"
                                        }`}
                                    >
                                        {e.is_registered
                                            ? "Registered"
                                            : "Not Registered"}
                                    </span>
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {e.event_date}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2">
                                <button
                                    disabled={e.is_registered}
                                    onClick={async () => {
                                        await registerIn(e.id);
                                        toast.success("Registered");
                                        loadEvents();
                                    }}
                                    className={`px-3 py-1 rounded text-white ${
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
                                    className={`px-3 py-1 rounded text-white ${
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
            </div>
        </>
    );
}
