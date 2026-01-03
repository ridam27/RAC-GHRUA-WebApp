import { useState, useEffect } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            if (user.system_role === "ADMIN") navigate("/dashboard/admin");
            else if (user.system_role === "ASST_ADMIN")
                navigate("/dashboard/asst-admin");
            else navigate("/dashboard/member");
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { email, password });
            login(res.data);
            toast.success("Login successful");
        } catch (err) {
            toast.error(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            {/* 🔹 WRAPPER */}
            <div className="w-full max-w-md">

                {/* 🔹 LOGIN CARD */}
                <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h2 className="text-2xl font-bold text-center mb-2">
                        RAC GHRUA - Portal
                    </h2>
                    <h1 className="text-xl font-semibold text-center mb-6">
                        Login
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <button className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                            Login
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-4">
                        Don&apos;t have an account?{" "}
                        <span
                            onClick={() => navigate("/signup")}
                            className="text-blue-600 cursor-pointer font-medium"
                        >
                            Sign Up
                        </span>
                    </p>
                </div>

                {/* 🔹 CREDIT FOOTER (CURVED RECTANGLE) */}
                <div className="mt-4 bg-white/80 backdrop-blur px-4 py-2 rounded-full shadow text-center">
                    <p className="text-sm text-gray-600">
                        Crafted with ❤️ by{" "}
                        <a
                            href="https://instagram.com/ridam_satkar"
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
