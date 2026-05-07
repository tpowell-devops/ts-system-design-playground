import axios from 'axios';
import {authStore} from "../../src/features/auth/authStore";

// Centralized HTTP client
// This is where all API calls flow through

//const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const apiUrl = import.meta.env.VITE_API_URL || '/api';
// console.log(import.meta.env.VITE_API_URL);
// console.log(http.defaults.baseURL);

export const http = axios.create({
    baseURL: apiUrl,
    withCredentials: true, //important to allow cookies to be sent cross-request
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to automatically attach the token
http.interceptors.request.use((config) => {
    const token = authStore.getToken();
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

http.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshResponse = await axios.post(
                    "/api/auth/refresh",
                    {},
                    {
                        withCredentials: true,
                    }
                );

                const newToken = refreshResponse.data.accessToken;

                authStore.setToken(newToken);

                originalRequest.headers.Authorization =
                    `Bearer ${newToken}`;

                return http(originalRequest);
            } catch (refreshError) {
                // authStore.setToken(null);
                authStore.clearToken();
                // optional:
                window.location.href = "/auth/login";

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default http;
// axios.get('/api/jobs')
// export const http = axios.create({
//     baseURL: 'http://localhost:3000', // your API service
//     headers: {
//         'Content-Type': 'application/json',
//     },
// });