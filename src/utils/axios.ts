import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && config.withCredentials !== false) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        if (config.withCredentials !== false) {
            config.withCredentials = true;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error) {
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;