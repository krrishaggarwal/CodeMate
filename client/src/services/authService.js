import { apiRequest } from './api';

export const loginUser = async (email, password) => {
  return await apiRequest('/api/auth/login', 'POST', { email, password });
};

export const registerUser = async (userData) => {
  return await apiRequest('/api/auth/register', 'POST', userData);
};
