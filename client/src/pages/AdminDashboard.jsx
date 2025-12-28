import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getAdminDashboard } from "../api/dashboard.api";

export default function AdminDashboard() {
    const [data, setData] = useState(null);

    useEffect(() => {
        getAdminDashboard().then((res) => setData(res.data));
    }, []);

    if (!data) return null;

    return (
        <>
            <Navbar />
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <Stat title="Total Users" value={data.total_users} />
                <Stat title="Members" value={data.members} />
                <Stat title="Asst Admins" value={data.asst_admins} />
                <Stat title="Admins" value={data.admins} />

                <Stat title="Paid Fees" value={data.paid} />
                <Stat title="Partial Fees" value={data.partial} />
                <Stat title="Unpaid Fees" value={data.unpaid} />

                <Stat title="Total Events" value={data.total_events} />
                <Stat title="Completed Events" value={data.completed_events} />
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
