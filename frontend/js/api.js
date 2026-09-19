const API_URL = 'http://localhost:5000/api';

// Set up Axios defaults
axios.defaults.baseURL = API_URL;

// Add a request interceptor to add the JWT token
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle 401s (Token expired/invalid)
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            if (!window.location.pathname.includes('auth.html') && !window.location.pathname.includes('index.html')) {
                window.location.href = 'auth.html';
            }
        }
        return Promise.reject(error);
    }
);

const api = {
    auth: {
        register: (data) => axios.post('/auth/register', data),
        login: (data) => axios.post('/auth/login', data),
        getMe: () => axios.get('/auth/me')
    },
    recipes: {
        getAll: (params) => axios.get('/recipes', { params }),
        getById: (id) => axios.get(`/recipes/${id}`),
        create: (data) => axios.post('/recipes', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
        update: (id, data) => axios.put(`/recipes/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
        delete: (id) => axios.delete(`/recipes/${id}`)
    },
    favorites: {
        getAll: () => axios.get('/favorites'),
        add: (data) => axios.post('/favorites', data),
        remove: (meal_id) => axios.delete(`/favorites/${meal_id}`)
    },
    shoppingList: {
        getAll: () => axios.get('/shopping-list'),
        add: (data) => axios.post('/shopping-list', data),
        update: (id, purchased) => axios.put(`/shopping-list/${id}`, { purchased }),
        delete: (id) => axios.delete(`/shopping-list/${id}`),
        clearPurchased: () => axios.delete('/shopping-list/clear/purchased')
    },
    profile: {
        update: (data) => axios.put('/profile', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
        changePassword: (data) => axios.put('/profile/password', data),
        delete: () => axios.delete('/profile'),
        getStats: () => axios.get('/profile/stats')
    }
};

// Toast utility
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-white bg-${type} border-0 mb-2`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">
                ${message}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}
