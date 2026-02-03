import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add ngrok header to bypass browser warning
    config.headers["ngrok-skip-browser-warning"] = "true";

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
