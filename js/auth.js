import api from './api.js';

const auth = {
    async login(email, password) {
        try {
            const data = await api.post('/auth/login', { email, password });
            this.setSession(data);
            return data;
        } catch (error) {
            throw error;
        }
    },

    async register(userData) {
        try {
            const data = await api.post('/auth/register', userData);
            this.setSession(data);
            return data;
        } catch (error) {
            throw error;
        }
    },

    setSession(authData) {
        localStorage.setItem('token', authData.token);
        localStorage.setItem('user', JSON.stringify({
            id: authData.id,
            email: authData.email,
            fullName: authData.fullName,
            role: authData.role
        }));
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.hash = '#login';
    },

    getUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
};

export default auth;
