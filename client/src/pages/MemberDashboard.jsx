import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getMemberDashboard } from "../api/dashboard.api";

export default function MemberDashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        getMemberDashboard().then((res) => setData(res.data));
    }, []);

    if (!data) return null;

    return (
        <>
            <Navbar />
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <StatCard title="Registered" value={data.total_registered} />
                <StatCard title="Attended" value={data.attended} />
                <StatCard title="Missed" value={data.missed} />
                <StatCard
                    title="Attendance %"
                    value={`${data.attendance_percentage}%`}
                />
            </div>
        </>
    );
}

function StatCard({ title, value }) {
    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-2xl font-semibold">{value}</div>
        </div>
    );
}
