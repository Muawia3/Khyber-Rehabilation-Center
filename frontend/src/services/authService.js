import { apiClient } from './apiClient.js';

export const authService = {
  login: async (credentials) => {
    return apiClient('/auth/login', { body: credentials });
  },

  logout: async () => {
    return apiClient('/auth/logout', { method: 'POST' });
  },

  getCurrentUser: async () => {
    return apiClient('/auth/me');
  },
};
