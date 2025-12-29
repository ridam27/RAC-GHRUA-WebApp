import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../api/axios";
import toast from "react-hot-toast";

export default function Profile() {
    const [profile, setProfile] = useState(null);
    const [saving, setSaving] = useState(false);

    const formatDate = (date) => {
        if (!date) return "";
        return date.split("T")[0];
    };



    const loadProfile = async () => {
        try {
            const res = await api.get("/profile");
            setProfile(res.data);
        } catch {
            toast.error("Failed to load profile");
        }
    };

    useEffect(() => {
        loadProfile();
    }, []);

    const saveProfile = async () => {
        try {
            setSaving(true);
            await api.put("/profile", profile);
            toast.success("Profile updated");
        } catch {
            toast.error("Update failed");
        } finally {
            setSaving(false);
        }
    };

    if (!profile) return null;

    const input = "border p-2 rounded w-full";

    return (
        <>
            <Navbar />

            <div className="max-w-xl mx-auto p-6">
                <h2 className="text-2xl font-semibold mb-6">My Profile</h2>

                {/* Editable Fields */}
                {["name", "mobile", "dob", "university"].map((field) => (
                    <div key={field} className="mb-4">
                        <label className="block text-sm font-medium mb-1 capitalize">
                            {field.replace("_", " ")}
                        </label>

                        <input
                            type={field === "dob" ? "date" : "text"}
                            value={
                                field === "dob"
                                    ? formatDate(profile.dob)
                                    : profile[field] || ""
                            }
                            onChange={(e) =>
                                setProfile({
                                    ...profile,
                                    [field]: e.target.value
                                })
                            }
                            className={input}
                        />
                    </div>
                ))}


                {/* Read-only Fields */}
                {[ "email", "system_role", "club_role", "club_fee_status"].map((field) => (
                    <div key={field} className="mb-4">
                        <label className="block text-sm font-medium mb-1 capitalize">
                            {field.replace("_", " ")}
                        </label>
                        <input
                            value={profile[field] || ""}
                            disabled
                            className={`${input} bg-gray-100`}
                        />
                    </div>
                ))}

                <button
                    onClick={saveProfile}
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
                >
                    {saving ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </>
    );
}
