import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAsstAdminDashboard } from "../api/dashboard.api";
import api from "../api/axios";
import { Link } from "react-router-dom";
import {
    Calendar,
    CalendarDays,
    CheckCircle,
    ListChecks,
    Plus,
    Users,
    FileText,
    BarChart3,
    MapPin,
    Instagram,
    Linkedin,
    Twitter,
    MessageCircle,
    ChartCandlestick,
    Mail
} from "lucide-react";

export default function AsstAdminDashboard() {
    const [data, setData] = useState(null);
    const [meetings, setMeetings] = useState([]);
    const [inPersonEvents, setInPersonEvents] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.name || "Assistant Admin";

    useEffect(() => {
        getAsstAdminDashboard().then((res) => setData(res.data));

        api.get("/inperson/inpevents").then((res) =>
            setInPersonEvents(
                res.data
                    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
                    .slice(0, 4)
            )
        );

        api.get("/inperson/meetings").then((res) =>
            setMeetings(
                res.data
                    .sort((a, b) => new Date(a.meeting_date) - new Date(b.meeting_date))
                    .slice(0, 4)
            )
        );
    }, []);

    if (!data) return null;

    return (
        <>
            <Navbar />

            <div className="max-w-7xl mx-auto p-6 space-y-6">

                {/* 👋 Welcome */}
                <h1 className="text-3xl font-semibold text-gray-800">
                    Welcome, <span className="text-blue-600">{username}</span> 👋
                </h1>

                {/* 🔳 TOP GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* ⬅ STATS */}
                    <div className="space-y-4">
                        <StatCard title="Total MD Events" value={data.total_events} icon={Calendar} />
                        <StatCard title="Upcoming MD Events" value={data.upcoming_events} icon={CalendarDays} />
                        <StatCard title="Completed MD Events" value={data.completed_events} icon={CheckCircle} />
                        <ContactAdminCard />
                    </div>



                    {/* 📍 IN-PERSON EVENTS */}
                    <DashboardCard title="Upcoming In-Person Events" icon={MapPin} accent="emerald">
                        {inPersonEvents.map((e) => (
                            <DashboardItem
                                key={e.id}
                                title={e.event_name}
                                date={formatDate(e.event_date)}
                                time={e.start_time}
                                accent="emerald"
                            />
                        ))}
                    </DashboardCard>

                    {/* 🗓 MEETINGS */}
                    <DashboardCard title="Upcoming Meetings" icon={Users} accent="indigo">
                        {meetings.map((m) => (
                            <DashboardItem
                                key={m.id}
                                title={m.title}
                                date={formatDate(m.meeting_date)}
                                time={m.start_time}
                                accent="indigo"
                            />
                        ))}
                    </DashboardCard>

                    {/* 🎯 QUICK ACTIONS */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
                        <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                            <ListChecks size={20} /> Quick Actions
                        </h3>

                        <div className="grid gap-4">
                            <ActionLink to="/inp-events" icon={Plus} label="Create In-Person Event" color="blue" />
                            <ActionLink to="/meetings" icon={Users} label="Create Meeting" color="emerald" />
                            <ActionLink to="/events" icon={FileText} label="View All MD Events" color="indigo" />
                            <ActionLink to="/user-stats" icon={BarChart3} label="Export Attendance" color="rose" />
                        </div>
                    </div>
                </div>

                {/* 📊 ATTENDANCE TABLE */}
                <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
                    <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                        <ChartCandlestick size={20} /> Attendance by Event
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-225 text-sm whitespace-nowrap">
                            <thead>
                                <tr className="text-gray-500">
                                    <th className="py-2 px-2 text-left w-15">#</th>
                                    <th className="py-2 text-left min-w-55">MultiDistrict Event Name</th>
                                    <th className="py-2 text-center min-w-35]">Date</th>
                                    <th className="py-2 text-center min-w-35">Attendance</th>
                                    <th className="py-2 text-center min-w-35">Status</th>
                                    <th className="py-2 text-center min-w-40">Certificate</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.attendance_by_event
                                    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
                                    .map((e, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition">
                                            <td className="py-2 px-2">{i + 1}</td>
                                            <td className="py-2 font-medium">{e.title}</td>
                                            <td className="py-2 text-center text-gray-500">
                                                {formatDate(e.event_date)}
                                            </td>
                                            <td className="py-2 text-center font-semibold">
                                                {e.present_count}
                                            </td>
                                            <td className={`py-2 text-center font-medium ${eventStatusColor(e.status)}`}>
                                                {e.status}
                                            </td>
                                            <td className={`py-2 text-center font-medium ${certificateColor(e.certificate_status)}`}>
                                                {e.certificate_status}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* ❤️ FOOTER */}
                <div className="bg-white rounded-2xl shadow p-4 flex flex-col md:flex-row items-center justify-between gap-3">
                    <p className="text-sm text-gray-600">
                        Crafted with ❤️ by <span className="font-medium text-red-700">Ridam Satkar</span>
                    </p>

                    <div className="flex gap-4">
                        <Social Icon={Instagram} href="https://www.instagram.com/ridam_27" hover="hover:bg-pink-500" />
                        <Social Icon={Linkedin} href="https://www.linkedin.com/in/ridam27" hover="hover:bg-blue-700" />
                        <Social Icon={Twitter} href="https://x.com/ridam_27" hover="hover:bg-black" />
                    </div>
                </div>
            </div>
        </>
    );
}

/* ================= COMPONENTS ================= */

function StatCard({ title, value, icon: Icon }) {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4 hover:-translate-y-1 hover:shadow-xl transition">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
                <Icon size={20} />
            </div>
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <p className="text-xl font-semibold">{value}</p>
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

function DashboardItem({ title, date, time, accent }) {
    const bgMap = {
        emerald: "bg-emerald-100 text-emerald-600",
        indigo: "bg-indigo-100 text-indigo-600"
    };

    return (
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 hover:bg-gray-100 transition">
            <div className={`p-2 rounded-lg ${bgMap[accent]}`}>
                <CalendarDays size={18} />
            </div>
            <div>
                <p className="font-medium">{title}</p>
                <p className="text-sm text-gray-500">
                    {date} {time && `• ${time}`}
                </p>
            </div>
        </div>
    );
}

function ActionLink({ to, icon: Icon, label, color }) {
    const colorMap = {
        blue: "hover:bg-blue-600 hover:text-white",
        emerald: "hover:bg-emerald-600 hover:text-white",
        indigo: "hover:bg-indigo-600 hover:text-white",
        rose: "hover:bg-rose-600 hover:text-white"
    };

    return (
        <Link
            to={to}
            className={`flex items-center gap-3 p-4 rounded-xl bg-gray-100 transition hover:-translate-y-1 hover:shadow-lg ${colorMap[color]}`}
        >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
        </Link>
    );
}

function Social({ Icon, href, hover }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`p-2 rounded-full bg-gray-100 text-gray-600 hover:text-white transition transform hover:scale-110 ${hover}`}
        >
            <Icon size={18} />
        </a>
    );
}

/* ================= HELPERS ================= */

function ContactAdminCard() {
    return (
        <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition space-y-3">
            <p className="text-sm text-gray-500 font-medium">
                Contact Admin
            </p>

            <div className="flex gap-3">
                {/* WhatsApp */}
                <a
                    href="https://wa.me/919403815696"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2
                                bg-green-100 text-green-700
                                rounded-lg py-2
                                hover:bg-green-600 hover:text-white
                                transition transform hover:-translate-y-0.5"
                >
                    <MessageCircle size={18} />
                    <span className="text-sm font-medium sm:inline">
                        WhatsApp
                    </span>
                </a>

                {/* Email */}
                <a
                    href="mailto:ridamsatkar1@gmail.com"
                    className="flex-1 flex items-center justify-center gap-2
                                bg-blue-100 text-blue-700
                                rounded-lg py-2
                                hover:bg-blue-600 hover:text-white
                                transition transform hover:-translate-y-0.5"
                >
                    <Mail size={18} />
                    <span className="text-sm font-medium sm:inline">
                        Email
                    </span>
                </a>
            </div>
        </div>
    );
}


function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB");
}

function eventStatusColor(status) {
    if (status === "UPCOMING") return "text-yellow-600";
    if (status === "COMPLETED") return "text-green-600";
    return "text-gray-500";
}

function certificateColor(status) {
    if (status === "RECEIVED") return "text-green-600";
    if (status === "NOT_RECEIVED") return "text-red-600";
    return "text-gray-500";
}
