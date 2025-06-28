// apiService.js

const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.storage = sessionStorage;
    this.token = this.storage.getItem('token');
    this.user = JSON.parse(this.storage.getItem('user') || 'null');
  }

  setPersistentStorage(rememberMe) {
    this.storage = rememberMe ? localStorage : sessionStorage;
  }

  isAuthenticated() {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!token || !user) {
      this.clearAuth();
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      if (payload.exp && payload.exp < currentTime) {
        this.clearAuth();
        return false;
      }
      return true;
    } catch (err) {
      this.clearAuth();
      return false;
    }
  }

  setAuth(token, user) {
    this.clearAuth();
    this.storage.setItem('token', token);
    this.storage.setItem('user', JSON.stringify(user));
    this.token = token;
    this.user = user;
  }

  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    this.token = null;
    this.user = null;
  }

  getToken() {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user') || 'null');
  }

  async login(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Login failed');
    this.setAuth(data.token, data.user);
    return data;
  }

  async register(formData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Registration failed');
    this.setAuth(data.token, data.user);
    return data;
  }

  logout() {
    this.clearAuth();
    window.location.href = '/home';
  }
}

const apiService = new ApiService();
export default apiService;
