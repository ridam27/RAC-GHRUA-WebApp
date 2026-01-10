import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
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

    const universities = ["RTMNU", "Amravati", "SkillTech"];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

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
            const payload = { ...form, dob: form.dob };
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">

                <div className="bg-white p-5 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-center mb-1">
                        RAC GHRUA - Portal
                    </h2>
                    <h3 className="text-lg font-semibold text-center mb-4">
                        Create Account
                    </h3>

                    <form onSubmit={handleSubmit} className="space-y-3">

                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="text"
                            name="mobile"
                            placeholder="Mobile Number"
                            value={form.mobile}
                            onChange={handleChange}
                            required
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        />

                        {/* ✅ DOB LABEL + DATE INPUT */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                name="dob"
                                value={form.dob}
                                onChange={handleChange}
                                required
                                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400"
                            />
                        </div>

                        <select
                            name="university"
                            value={form.university}
                            onChange={handleChange}
                            required
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400"
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
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        />

                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-400"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white p-2.5 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            {loading ? "Signing Up..." : "Sign Up"}
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-3 text-sm">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-blue-600 cursor-pointer font-medium"
                        >
                            Log in
                        </span>
                    </p>
                </div>

                <div className="mt-3 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow text-center">
                    <p className="text-xs text-gray-600">
                        Crafted with ❤️ by{" "}
                        <a
                            href="https://instagram.com/ridam_27"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-gray-800 hover:text-red-600 transition"
                        >
                            Ridam Satkar
                        </a>
                    </p>
                </div>

            </div>
        </div>
    );
}
