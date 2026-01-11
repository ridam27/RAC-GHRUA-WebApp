import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
});

// 🔹 REQUEST INTERCEPTOR (same as before)
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 🔹 RESPONSE INTERCEPTOR (FIXES STUCK ISSUE)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            const status = error.response.status;

            if (status === 401 || status === 403) {
                // 🔥 Force logout & redirect
                localStorage.clear();

                // Avoid infinite reload
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            }
        }

        return Promise.reject(error);
    }
);

export default api;
