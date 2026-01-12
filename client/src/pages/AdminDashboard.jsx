import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAdminDashboard } from "../api/dashboard.api";
import api from "../api/axios";
import { Link } from "react-router-dom";
import {
    Users,
    CalendarDays,
    UserCheck,
    Shield,
    Wallet,
    Calendar,
    CheckCircle,
    ListChecks,
    Plus,
    UsersRound,
    FileText,
    Instagram,
    Linkedin,
    Twitter,
    MapPin
} from "lucide-react";

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [meetings, setMeetings] = useState([]);
    const [inPersonEvents, setInPersonEvents] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const username = user?.name || "Admin";
    

    useEffect(() => {
        getAdminDashboard().then((res) => setData(res.data));

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

                {/* 👋 HEADER */}
                <h1 className="text-3xl font-semibold text-gray-800">
                    Welcome, <span className="text-blue-600">{username}</span> 👋
                </h1>

                {/* 🔳 TOP SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* ⬅ VISUAL STATS */}
                    <div className="space-y-4">
                        <StatCard title="Total Users" value={data.total_users} icon={Users} color="blue" />
                        <StatCard title="Admins" value={data.admins} icon={Shield} color="rose" />
                        <StatCard title="Asst. Admins" value={data.asst_admins} icon={UsersRound} color="indigo" />
                        <StatCard title="Members" value={data.members} icon={UserCheck} color="emerald" />
                    </div>

                    {/* 🎯 QUICK ACTIONS */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition">
                        <h3 className="text-lg font-semibold mb-5 flex items-center gap-2">
                            <ListChecks size={20} /> Quick Actions
                        </h3>

                        <div className="grid gap-4">
                            <ActionLink to="/inp-events" icon={Plus} label="Create In-Person Event" color="blue" />
                            <ActionLink to="/meetings" icon={Users} label="Create Meeting" color="emerald" />
                            <ActionLink to="/admin/users" icon={UserCheck} label="Edit User Data" color="indigo" />
                            <ActionLink to="/event-history" icon={FileText} label="Manage MD Events" color="rose" />
                        </div>
                    </div>

                    {/* 📅 UPCOMING EVENTS (UI READY) */}
                    <DashboardCard title="Upcoming Events" icon={Calendar} accent="emerald">
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

                    {/* 🗓 UPCOMING MEETINGS (UI READY) */}
                    <DashboardCard title="Upcoming Meetings" icon={MapPin} accent="indigo">
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
                </div>

                {/* 📊 SECOND ROW STATS */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <StatCard title="Completed MD Events" value={data.completed_events} icon={CheckCircle} color="green" />
                    <StatCard title="Paid Fees" value={data.paid} icon={Wallet} color="emerald" />
                    <StatCard title="Partial Fees" value={data.partial} icon={Wallet} color="yellow" />
                    <StatCard title="Unpaid Fees" value={data.unpaid} icon={Wallet} color="rose" />
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

function StatCard({ title, value, icon: Icon, color }) {
    const colorMap = {
        blue: "bg-blue-100 text-blue-600",
        emerald: "bg-emerald-100 text-emerald-600",
        indigo: "bg-indigo-100 text-indigo-600",
        rose: "bg-rose-100 text-rose-600",
        yellow: "bg-yellow-100 text-yellow-600",
        green: "bg-green-100 text-green-600"
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-4 flex items-center gap-4 hover:-translate-y-1 hover:shadow-xl transition">
            <div className={`p-3 rounded-lg ${colorMap[color]}`}>
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
            {children}
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

function EmptyState({ text }) {
    return (
        <div className="text-sm text-gray-400 text-center py-6">
            {text}
        </div>
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

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-GB");
}