import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
    getEventById,
    registerIn,
    registerOut
} from "../api/event.api";
import toast from "react-hot-toast";

export default function EventDetails() {
    const { id } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    const fetchEvent = async () => {
        const res = await getEventById(id);
        setEvent(res.data);
    };

    const handleRegisterIn = async () => {
        try {
            setLoading(true);
            await registerIn(id);
            toast.success("Registered successfully");
            setEvent({ ...event, is_registered: true });
        } catch {
            toast.error("Failed to register");
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterOut = async () => {
        try {
            setLoading(true);
            await registerOut(id);
            toast.success("Unregistered successfully");
            setEvent({ ...event, is_registered: false });
        } catch {
            toast.error("Failed to unregister");
        } finally {
            setLoading(false);
        }
    };

    if (!event) return null;

    return (
        <>
            <Navbar />

            <div className="p-6 max-w-3xl mx-auto">
                <h2 className="text-2xl font-semibold mb-2 flex items-center gap-2">
                    {event.title}
                    {event.is_registered && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                            Registered
                        </span>
                    )}
                </h2>

                <p className="text-gray-600 mb-4">{event.description}</p>

                {event.joining_link && event.is_registered && (
                    <div className="bg-blue-100 p-4 rounded">
                        <a
                            href={
                                event.joining_link.startsWith("http")
                                    ? event.joining_link
                                    : `https://${event.joining_link}`
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-700 underline font-medium"
                        >
                            Join Event
                        </a>
                    </div>
                )}

                <br />

                <div className="flex gap-3 mb-6">
                    <button
                        disabled={event.is_registered || loading}
                        onClick={handleRegisterIn}
                        className={`px-4 py-2 rounded text-white ${
                            event.is_registered
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-green-500"
                        }`}
                    >
                        I’m In
                    </button>

                    <button
                        disabled={!event.is_registered || loading}
                        onClick={handleRegisterOut}
                        className={`px-4 py-2 rounded text-white ${
                            !event.is_registered
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-red-500"
                        }`}
                    >
                        I’m Out
                    </button>
                </div>

                
            </div>
        </>
    );
}
