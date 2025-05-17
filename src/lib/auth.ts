
import api from './api';
import { User } from './types';

export const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data;
  localStorage.setItem('token', token);
  return user;
};

export const register = async (name: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { 
    name, 
    email, 
    password,
    role: 'CUSTOMER' 
  });
  return response.data;
};

export const verifyEmail = async (email: string, otp: string) => {
  const response = await api.post('/auth/verify-email', { email, otp });
  return response.data;
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await api.get('/users/me');
  return response.data.user;
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};
