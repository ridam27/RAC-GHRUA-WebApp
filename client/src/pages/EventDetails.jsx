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

    useEffect(() => {
        getEventById(id).then((res) => setEvent(res.data));
    }, [id]);

    if (!event) return null;

    return (
        <>
            <Navbar />
            <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-4">{event.description}</p>

                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => registerIn(id).then(() => toast.success("Registered"))}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        I’m In
                    </button>
                    <button
                        onClick={() =>
                            registerOut(id).then(() => toast.success("Unregistered"))
                        }
                        className="bg-red-500 text-white px-4 py-2 rounded"
                    >
                        I’m Out
                    </button>
                </div>

                {event.joining_link && (
                    <div className="bg-blue-100 p-3 rounded">
                        <a
                            href={event.joining_link}
                            target="_blank"
                            className="text-blue-700 underline"
                        >
                            Join Event
                        </a>
                    </div>
                )}
            </div>
        </>
    );
}
