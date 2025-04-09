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

// Add request interceptor to check token expiration
api.interceptors.request.use(async (config) => {
    // Skip token refresh for auth endpoints
    if (config.url?.includes('/auth/')) {
        return config;
    }

    try {
        // Check if token is expired or about to expire (within 5 minutes)
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/me`, {
            credentials: 'include'
        });

        if (response.status === 401) {
            // Token is expired, try to refresh
            const refreshResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/refresh`, {
                method: 'POST',
                credentials: 'include'
            });

            if (!refreshResponse.ok) {
                // Refresh failed, redirect to login
                window.location.href = '/';
                return Promise.reject(new Error('Token refresh failed'));
            }
        }
    } catch (error) {
        console.error('Token check failed:', error);
        return Promise.reject(error);
    }

    return config;
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