import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function AdminMembers() {
    const [users, setUsers] = useState([]);
    const [savingId, setSavingId] = useState(null);

    const formatDate = (date) => {
        if (!date) return "";
        return date.split("T")[0];
    };



    const loadUsers = async () => {
        try {
            const res = await api.get("/admin/users");
            setUsers(res.data);
        } catch {
            toast.error("Failed to load members");
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const updateUser = async (user) => {
        try {
            setSavingId(user.id);
            await api.put(`/admin/users/${user.id}`, user);
            toast.success("Updated");
        } catch {
            toast.error("Update failed");
        } finally {
            setSavingId(null);
        }
    };

    const handleChange = (index, field, value) => {
        const updated = [...users];
        updated[index][field] = value;
        setUsers(updated);
    };

    return (
        <>
            <Navbar />

            <div className="p-6 overflow-x-auto">
                <h2 className="text-2xl font-semibold mb-4">Registered Members</h2>

                <table className="min-w-full bg-white rounded shadow text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2">Name</th>
                            <th className="p-2">Mobile</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">DOB</th>
                            <th className="p-2">University</th>
                            <th className="p-2">System Role</th>
                            <th className="p-2">Club Role</th>
                            <th className="p-2">Fee Status</th>
                            <th className="p-2">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user, i) => (
                            <tr key={user.id} className="border-b">
                                <td className="p-2">
                                    <input
                                        value={user.name}
                                        onChange={(e) =>
                                            handleChange(i, "name", e.target.value)
                                        }
                                        className="border p-1 rounded w-full"
                                    />
                                </td>

                                <td className="p-2">
                                    <input
                                        value={user.mobile || ""}
                                        onChange={(e) =>
                                            handleChange(i, "mobile", e.target.value)
                                        }
                                        className="border p-1 rounded w-full"
                                    />
                                </td>

                                <td className="p-2">
                                    <input
                                        value={user.email}
                                        onChange={(e) =>
                                            handleChange(i, "email", e.target.value)
                                        }
                                        className="border p-1 rounded w-full"
                                    />
                                </td>

                                <td className="p-2">
                                    <input
                                        type="date"
                                        value={formatDate(user.dob)}
                                        onChange={(e) =>
                                            handleChange(i, "dob", e.target.value)
                                        }
                                        className="border p-1 rounded w-full"
                                    />

                                </td>

                                <td className="p-2">
                                    <input
                                        value={user.university || ""}
                                        onChange={(e) =>
                                            handleChange(i, "university", e.target.value)
                                        }
                                        className="border p-1 rounded w-full"
                                    />
                                </td>

                                <td className="p-2">
                                    <select
                                        value={user.system_role}
                                        onChange={(e) =>
                                            handleChange(i, "system_role", e.target.value)
                                        }
                                        className="border p-1 rounded w-full"
                                    >
                                        <option>ADMIN</option>
                                        <option>ASST_ADMIN</option>
                                        <option>MEMBER</option>
                                    </select>
                                </td>

                                <td className="p-2">
                                    <input
                                        value={user.club_role || ""}
                                        onChange={(e) =>
                                            handleChange(i, "club_role", e.target.value)
                                        }
                                        className="border p-1 rounded w-full"
                                    />
                                </td>

                                <td className="p-2">
                                    <select
                                        value={user.club_fee_status}
                                        onChange={(e) =>
                                            handleChange(i, "club_fee_status", e.target.value)
                                        }
                                        className="border p-1 rounded w-full"
                                    >
                                        <option>PAID</option>
                                        <option>PARTIAL</option>
                                        <option>UNPAID</option>
                                    </select>
                                </td>

                                <td className="p-2">
                                    <button
                                        onClick={() => updateUser(user)}
                                        disabled={savingId === user.id}
                                        className="bg-blue-600 text-white px-3 py-1 rounded"
                                    >
                                        {savingId === user.id ? "Saving..." : "Save"}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="text-gray-500 mt-4">No users found</div>
                )}
            </div>
        </>
    );
}
