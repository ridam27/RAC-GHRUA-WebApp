import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAsstAdminDashboard } from "../api/dashboard.api";

export default function AsstAdminDashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        getAsstAdminDashboard().then((res) => setData(res.data));
    }, []);

    if (!data) return null;

    return (
        <>
            <Navbar />
            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Stat title="Total Events" value={data.total_events} />
                    <Stat title="Upcoming" value={data.upcoming_events} />
                    <Stat title="Completed" value={data.completed_events} />
                </div>

                <div className="bg-white rounded shadow p-4">
                    <h3 className="font-semibold mb-3">Attendance by Event</h3>
                    {data.attendance_by_event.map((e, i) => (
                        <div
                            key={i}
                            className="flex justify-between border-b py-2 text-sm"
                        >
                            <span>{e.title}</span>
                            <span>{e.present_count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

function Stat({ title, value }) {
    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">{title}</div>
            <div className="text-2xl font-semibold">{value}</div>
        </div>
    );
}
