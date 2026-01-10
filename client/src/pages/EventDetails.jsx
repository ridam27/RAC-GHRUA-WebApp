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
    const [daysRemaining, setDaysRemaining] = useState(0);

    useEffect(() => {
        fetchEvent();
    }, [id]);

    useEffect(() => {
        if (!event?.event_date) return;

        const today = new Date();
        const eventDate = new Date(event.event_date);
        const diffTime = eventDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        setDaysRemaining(diffDays > 0 ? diffDays : 0);
    }, [event]);

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

    const formatDate = (date) => {
        const d = new Date(date);
        return `${String(d.getDate()).padStart(2, "0")}/${String(
            d.getMonth() + 1
        ).padStart(2, "0")}/${d.getFullYear()}`;
    };

    if (!event) return null;

    return (
        <>
            <Navbar />

            {/* 🔹 PAGE CONTAINER */}
            <div className="bg-gray-100 px-4 py-6 sm:py-8 min-h-[calc(100vh-64px)]">
                <div className="max-w-3xl mx-auto">

                    {/* 🔹 EVENT CARD */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 space-y-6">

                        {/* 🔹 TITLE */}
                        <div className="space-y-2">
                            <h2 className="text-2xl sm:text-3xl font-bold flex flex-wrap gap-2 items-center">
                                {event.title}
                                {event.is_registered && (
                                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                        Registered
                                    </span>
                                )}
                            </h2>

                            <div className="flex flex-wrap gap-3 text-sm">
                                <span className="bg-gray-100 px-3 py-1 rounded-full">
                                    📅 {formatDate(event.event_date)}
                                </span>

                                <span
                                    className={`px-3 py-1 rounded-full font-medium ${
                                        daysRemaining > 0
                                            ? "bg-blue-100 text-blue-700"
                                            : "bg-gray-200 text-gray-600"
                                    }`}
                                >
                                    ⏳ {daysRemaining} Days Remaining
                                </span>
                            </div>
                        </div>

                        {/* 🔹 DESCRIPTION */}
                        <div>
                            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
                                Event Description
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                {event.description}
                            </p>
                        </div>

                        {/* 🔹 JOIN EVENT BUTTON */}
                        {event.joining_link && event.is_registered && (
                            <div className="pt-2">
                                <a
                                    href={
                                        event.joining_link.startsWith("http")
                                            ? event.joining_link
                                            : `https://${event.joining_link}`
                                    }
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-md"
                                >
                                    🚀 Join Event
                                </a>
                            </div>
                        )}

                        {/* 🔹 ACTION BUTTONS */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <button
                                disabled={event.is_registered || loading}
                                onClick={handleRegisterIn}
                                className={`flex-1 py-3 rounded-xl text-white font-semibold transition ${
                                    event.is_registered
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-green-600 hover:bg-green-700"
                                }`}
                            >
                                I’m In
                            </button>

                            <button
                                disabled={!event.is_registered || loading}
                                onClick={handleRegisterOut}
                                className={`flex-1 py-3 rounded-xl text-white font-semibold transition ${
                                    !event.is_registered
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-red-600 hover:bg-red-700"
                                }`}
                            >
                                I’m Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
