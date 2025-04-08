import axios from 'axios';

export interface AuthResponse {
    authUrl: string;
}

export interface User {
    id: string;
    username: string;
    profileImageUrl?: string;
}

export interface ApiError {
    message: string;
    details?: any;
}

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            const apiError: ApiError = {
                message: error.response.data?.message || 'An error occurred',
                details: error.response.data?.details,
            };
            return Promise.reject(apiError);
        } else if (error.request) {
            // The request was made but no response was received
            return Promise.reject({
                message: 'No response received from server',
            });
        } else {
            // Something happened in setting up the request that triggered an Error
            return Promise.reject({
                message: error.message || 'An error occurred',
            });
        }
    }
);

export default api; 