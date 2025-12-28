import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getEvents, registerIn, registerOut } from "../api/event.api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Events() {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        getEvents().then((res) => setEvents(res.data));
    }, []);

    const handleIn = async (id) => {
        await registerIn(id);
        toast.success("Registered");
    };

    const handleOut = async (id) => {
        await registerOut(id);
        toast.success("Unregistered");
    };

    return (
        <>
            <Navbar />
            <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">Upcoming Events</h2>

                <div className="grid gap-4">
                    {events.map((e) => (
                        <div
                            key={e.id}
                            className="bg-white p-4 rounded shadow flex justify-between"
                        >
                            <div onClick={() => navigate(`/events/${e.id}`)}>
                                <h3 className="font-semibold">{e.title}</h3>
                                <p className="text-sm text-gray-500">{e.date}</p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleIn(e.id)}
                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                >
                                    I’m In
                                </button>
                                <button
                                    onClick={() => handleOut(e.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
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
