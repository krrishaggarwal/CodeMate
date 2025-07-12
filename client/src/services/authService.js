import { apiRequest } from './api';

export const loginUser = async (email, password) => {
  try {
    const response = await apiRequest('/api/auth/login', 'POST', { email, password });
    return response;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await apiRequest('/api/auth/register', 'POST', userData);
    return response;
  } catch (error) {
    throw error;
  }
};
