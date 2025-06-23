import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const register = (username, password) =>
  axios.post(`${API_URL}/register`, { username, password });

export const login = (username, password) =>
  axios.post(`${API_URL}/login`, { username, password });

export const refreshToken = (refreshToken) =>
  axios.post(`${API_URL}/refresh-token`, { refreshToken });

export const getMe = (token) =>
  axios.get(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
