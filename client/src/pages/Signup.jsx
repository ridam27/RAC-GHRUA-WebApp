import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios"; // your axios instance
import toast from "react-hot-toast";

export default function Signup() {



    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        mobile: "",
        dob: "",
        university: "",
        password: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);

    // Universities dropdown
    const universities = ["RTMNU", "Amravati", "SkillTech"];

    // Update form state
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            return toast.error("Passwords do not match");
        }

        if (!universities.includes(form.university)) {
            return toast.error("Please select a valid university");
        }

        setLoading(true);
        try {
            // ✅ FIX: ensure DOB stays as YYYY-MM-DD string
            const payload = {
                ...form,
                dob: form.dob // already YYYY-MM-DD, no Date conversion
            };

            const res = await api.post("/auth/signup", payload);
            toast.success(res.data.message);
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };


    return (
        <>

            <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
                <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center">
                        RAC GHRUA - Portal
                    </h2>
                    <h2 className="text-2xl font-semibold mb-6 text-center">
                        Create Account
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="text"
                            name="mobile"
                            placeholder="Mobile Number"
                            value={form.mobile}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="date"
                            name="dob"
                            value={form.dob}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <select
                            name="university"
                            value={form.university}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select University</option>
                            {universities.map((u) => (
                                <option key={u} value={u}>
                                    {u}
                                </option>
                            ))}
                        </select>

                        <input
                            type="password"
                            name="password"
                            placeholder="Create Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-4">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-blue-600 cursor-pointer"
                        >
                            Log in
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
}
