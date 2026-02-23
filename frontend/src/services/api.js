import axios from 'axios';

const API_URL = 'http://localhost:8000/api/auth/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');
            
            if (refreshToken) {
                try {
                    const response = await axios.post(`${API_URL}refresh/`, {
                        refresh: refreshToken,
                    });
                    
                    const { access } = response.data;
                    localStorage.setItem('access_token', access);
                    
                    originalRequest.headers['Authorization'] = `Bearer ${access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }
        
        return Promise.reject(error);
    }
);

export const authService = {
    register: (userData) => api.post('register/', userData),
    login: (credentials) => api.post('login/', credentials),
    logout: (refreshToken) => api.post('logout/', { refresh: refreshToken }),
    getProfile: () => api.get('profile/'),
    updateProfile: (data) => api.put('profile/update/', data),
    changePassword: (data) => api.post('change-password/', data),
};

export default api;
