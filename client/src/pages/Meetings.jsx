import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import {
    Users,
    CalendarDays,
    Clock,
    Plus,
    X,
    Trash2
} from "lucide-react";

export default function Meetings() {
    const [meetings, setMeetings] = useState([]);
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        meeting_date: "",
        start_time: ""
    });

    useEffect(() => {
        fetchMeetings();
    }, []);

    const fetchMeetings = async () => {
        const res = await api.get("/inperson/meetings");
        setMeetings(res.data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await api.post("/inperson/meetings", form);

        setForm({ title: "", meeting_date: "", start_time: "" });
        setOpen(false);
        fetchMeetings();
    };

    const handleDelete = async () => {
        await api.delete(`/inperson/meetings/${deleteId}`);
        setDeleteId(null);
        fetchMeetings();
    };

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto p-6 space-y-6">

                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-800 flex items-center gap-2">
                        <Users className="text-emerald-600" />
                        Meetings
                    </h1>

                    <button
                        onClick={() => setOpen(true)}
                        className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-700 transition"
                    >
                        <Plus size={18} /> Schedule Meeting
                    </button>
                </div>

                {/* Meetings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {meetings.map((m) => (
                        <div
                            key={m.id}
                            className="relative group bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-5 border-l-4 border-emerald-500"
                        >
                            {/* ❌ Delete Icon */}
                            <button
                                onClick={() => setDeleteId(m.id)}
                                className="absolute top-3 right-3
                                            opacity-100 md:opacity-0
                                            md:group-hover:opacity-100
                                            transition
                                            bg-red-100 text-red-600 p-1.5 rounded-full
                                            hover:bg-red-600 hover:text-white
                                        "
                            >
                                <X size={16} />
                            </button>

                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                {m.title}
                            </h3>

                            <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                    <CalendarDays size={16} />
                                    {formatDate(m.meeting_date)}
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock size={16} />
                                    {m.start_time}
                                </div>
                            </div>

                            <div className="mt-4 text-xs text-gray-400">
                                Created by {m.created_by_name || "Admin"}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= ADD MODAL ================= */}
            {open && (
                <Modal
                    title="Schedule Meeting"
                    onClose={() => setOpen(false)}
                >
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Meeting Title"
                            value={form.title}
                            onChange={(e) =>
                                setForm({ ...form, title: e.target.value })
                            }
                        />
                        <Input
                            type="date"
                            label="Meeting Date"
                            value={form.meeting_date}
                            onChange={(e) =>
                                setForm({ ...form, meeting_date: e.target.value })
                            }
                        />
                        <Input
                            type="time"
                            label="Start Time"
                            value={form.start_time}
                            onChange={(e) =>
                                setForm({ ...form, start_time: e.target.value })
                            }
                        />

                        <ModalActions
                            onCancel={() => setOpen(false)}
                            confirmText="Create Meeting"
                            color="emerald"
                        />
                    </form>
                </Modal>
            )}

            {/* ================= DELETE CONFIRM ================= */}
            {deleteId && (
                <Modal
                    title="Delete Meeting"
                    onClose={() => setDeleteId(null)}
                >
                    <div className="flex items-center gap-3 text-red-600">
                        <Trash2 />
                        <p className="text-sm">
                            Are you sure you want to delete this meeting?
                        </p>
                    </div>

                    <ModalActions
                        onCancel={() => setDeleteId(null)}
                        onConfirm={handleDelete}
                        confirmText="Delete"
                        color="red"
                    />
                </Modal>
            )}
        </>
    );
}

/* ================= REUSABLE UI ================= */

function Modal({ children, title, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
}

function Input({ label, type = "text", ...props }) {
    return (
        <div>
            <label className="text-sm text-gray-600">{label}</label>
            <input
                type={type}
                required
                {...props}
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            />
        </div>
    );
}

function ModalActions({
    onCancel,
    onConfirm,
    confirmText,
    color = "emerald"
}) {
    return (
        <div className="flex justify-end gap-3 pt-6">
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-lg border hover:bg-gray-50"
            >
                Cancel
            </button>
            <button
                onClick={onConfirm}
                type="submit"
                className={`px-5 py-2 rounded-lg bg-${color}-600 text-white hover:bg-${color}-700 shadow`}
            >
                {confirmText}
            </button>
        </div>
    );
}

/* ================= UTILS ================= */
function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB");
}
