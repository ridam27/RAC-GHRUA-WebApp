import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMemberDashboard } from "../api/dashboard.api";
import api from "../api/axios";
import {
    Calendar,
    CheckCircle,
    XCircle,
    ListChecks,
    Activity,
    CalendarDays,
    Clock,
    MapPin,
    Users,
    Instagram,
    Linkedin,
    Twitter
} from "lucide-react";

export default function MemberDashboard() {
    const [stats, setStats] = useState(null);
    const [meetings, setMeetings] = useState([]);
    const [inPersonEvents, setInPersonEvents] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.name || "Member";

    useEffect(() => {
        getMemberDashboard().then((res) => setStats(res.data));

        api.get("/inperson/inpevents").then((res) =>
            setInPersonEvents(
                res.data
                    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
                    .slice(0, 3)
            )
        );

        api.get("/inperson/meetings").then((res) =>
            setMeetings(
                res.data
                    .sort((a, b) => new Date(a.meeting_date) - new Date(b.meeting_date))
                    .slice(0, 3)
            )
        );
    }, []);

    if (!stats) return null;

    const { label, color } = attendanceStatus(stats.attendance_percentage);

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto p-6 space-y-6">

                {/* 👋 Welcome */}
                <h1 className="text-3xl font-semibold text-gray-800">
                    Welcome, <span className="text-blue-600">{username}</span> 👋
                </h1>

                {/* 🔳 MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* ⬅ LEFT STATS */}
                    <div className="space-y-4">
                        <MiniStat title="Total Events" value={stats.total_events} icon={Calendar} />
                        <MiniStat title="Registered" value={stats.registered_events} icon={ListChecks} />
                        <MiniStat title="Attended" value={stats.attended} icon={CheckCircle} />
                        <MiniStat title="Missed" value={stats.missed} icon={XCircle} />
                    </div>

                    {/* 🎯 CENTER ATTENDANCE */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center justify-center hover:shadow-2xl transition">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                            <Activity size={20} /> Attendance Overview
                        </h3>

                        <SemiGauge percentage={stats.attendance_percentage} color={color} />

                        <p className={`mt-4 text-lg font-semibold ${color}`}>
                            {label}
                        </p>
                    </div>

                    {/* ➡ EVENTS & MEETINGS */}
                    <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* 📍 IN-PERSON EVENTS */}
                        <DashboardCard
                            title="Upcoming In-Person Events"
                            icon={MapPin}
                            accent="emerald"
                        >
                            {inPersonEvents.map((e) => (
                                <DashboardItem
                                    key={e.id}
                                    title={e.event_name}
                                    date={formatDate(e.event_date)}
                                    time={e.start_time}
                                    icon={CalendarDays}
                                    accent="emerald"
                                />
                            ))}
                        </DashboardCard>

                        {/* 🗓 MEETINGS */}
                        <DashboardCard
                            title="Upcoming Meetings"
                            icon={Users}
                            accent="indigo"
                        >
                            {meetings.map((m) => (
                                <DashboardItem
                                    key={m.id}
                                    title={m.title}
                                    date={formatDate(m.meeting_date)}
                                    time={m.start_time}
                                    icon={Clock}
                                    accent="indigo"
                                />
                            ))}
                        </DashboardCard>
                    </div>
                </div>

                {/* ❤️ FOOTER */}
                <div className="bg-white rounded-2xl shadow p-4 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-gray-600">
                        Crafted with ❤️ by <span className="font-medium text-red-700">Ridam Satkar</span>
                    </p>

                    <div className="flex gap-4">
                        <Social
                            Icon={Instagram}
                            hover="hover:bg-pink-500"
                            label="Instagram"
                            href="https://www.instagram.com/ridam_27"
                        />
                        <Social
                            Icon={Linkedin}
                            hover="hover:bg-blue-700"
                            label="LinkedIn"
                            href="https://www.linkedin.com/in/ridam27"
                        />
                        <Social
                            Icon={Twitter}
                            hover="hover:bg-black"
                            label="X (Twitter)"
                            href="https://x.com/ridam_27"
                        />
                    </div>

                </div>
            </div>
        </>
    );
}

/* ================= COMPONENTS ================= */

function MiniStat({ title, value, icon: Icon }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4 hover:-translate-y-1 hover:shadow-xl transition">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-xl font-semibold text-gray-800">{value}</p>
            </div>
        </div>
    );
}

function DashboardCard({ title, icon: Icon, accent, children }) {
    const accentMap = {
        emerald: "border-emerald-500 text-emerald-600",
        indigo: "border-indigo-500 text-indigo-600"
    };

    return (
        <div className={`bg-white rounded-2xl shadow-lg p-5 border-l-4 ${accentMap[accent]} hover:shadow-xl transition`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${accentMap[accent]}`}>
                <Icon size={20} /> {title}
            </h3>
            <div className="space-y-3">{children}</div>
        </div>
    );
}

function DashboardItem({ title, date, time, icon: Icon, accent }) {
    const bgMap = {
        emerald: "bg-emerald-100 text-emerald-600",
        indigo: "bg-indigo-100 text-indigo-600"
    };

    return (
        <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${bgMap[accent]}`}>
                    <Icon size={18} />
                </div>
                <div>
                    <p className="font-medium text-gray-800">{title}</p>
                    <p className="text-sm text-gray-500">
                        {date} {time && `• ${time}`}
                    </p>
                </div>
            </div>
        </div>
    );
}

/* 🔵 SEMI CIRCLE GAUGE */
function SemiGauge({ percentage, color }) {
    return (
        <div className="relative w-52 h-28">
            <svg viewBox="0 0 100 50" className="w-full h-full">
                <path d="M10 50 A40 40 0 0 1 90 50" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                <path
                    d="M10 50 A40 40 0 0 1 90 50"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="10"
                    className={color}
                    strokeDasharray={`${percentage * 1.26} 126`}
                />
            </svg>
            <div className="absolute inset-0 flex items-end justify-center pb-1 text-3xl font-semibold">
                {percentage}%
            </div>
        </div>
    );
}

function Social({ Icon, href, label, hover }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={` p-2 rounded-full bg-gray-100 text-gray-600 hover:text-white
                        transition transform hover:scale-110
                        ${hover}
                        `}
        >
            <Icon size={18} />
        </a>
    );
}


/* ================= HELPERS ================= */

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB");
}

function attendanceStatus(p) {
    if (p < 40) return { label: "Poor", color: "text-red-500" };
    if (p < 60) return { label: "Average", color: "text-yellow-500" };
    if (p < 80) return { label: "Good", color: "text-blue-500" };
    return { label: "Excellent", color: "text-green-600" };
}
