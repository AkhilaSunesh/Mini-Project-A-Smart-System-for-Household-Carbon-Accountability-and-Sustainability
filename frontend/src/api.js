import axios from 'axios';

const api = axios.create({
    baseURL: '/api',
    headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// On 401, try refreshing the token once
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                try {
                    const res = await axios.post('/api/users/refresh/', { refresh: refreshToken });
                    const newAccess = res.data.access;
                    localStorage.setItem('access_token', newAccess);
                    originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                    return api(originalRequest);
                } catch {
                    // Refresh failed — clear tokens and redirect to login
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('username');
                    window.location.hash = '#/login';
                }
            } else {
                localStorage.removeItem('access_token');
                localStorage.removeItem('username');
                window.location.hash = '#/login';
            }
        }

        return Promise.reject(error);
    }
);

/* ── Auth ── */
export const registerUser = (username, email, password) =>
    api.post('/users/register/', { username, email, password });

export const loginUser = (username, password) =>
    api.post('/users/login/', { username, password });

/* ── User Profile ── */
export const getProfile = () => api.get('/users/profile/');

/* ── Leaderboard ── */
export const getLeaderboard = () => api.get('/leaderboard/');

/* ── Marketplace ── */
export const getMarketplaceProjects = () => api.get('/marketplace/projects/');
export const purchaseCredits = (projectId, credits) =>
    api.post('/marketplace/purchase/', { project_id: projectId, credits });
export const getPurchaseHistory = () => api.get('/marketplace/history/');

/* ── Reports / Eco-Actions ── */
export const submitEcoAction = (formData) =>
    api.post('/reports/submit/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

export const getMySubmissions = () => api.get('/reports/my/');

/* ── Carbon Tracker ── */
export const submitCarbonReport = (data) => api.post('/reports/carbon/submit/', data);
export const getCarbonHistory = () => api.get('/reports/carbon/history/');

export default api;
