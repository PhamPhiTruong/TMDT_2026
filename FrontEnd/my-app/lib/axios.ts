import axios from "axios";

export class AppError extends Error {
    code: number;
    constructor(message: string, code: number) {
        super(message);
        this.code = code;
        this.name = "AppError";
    }
}

const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    timeout: 10000,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.removeItem("token");
                // ponytail: chỉ log, chưa redirect login
                console.warn("Unauthorized, token removed");
            }
            throw new AppError(
                error.response.data?.message || "API Error",
                error.response.status
            );
        }
        throw new AppError(error.message, 0);
    }
);

export default api;
