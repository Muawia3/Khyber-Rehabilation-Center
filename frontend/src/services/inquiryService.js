import { apiClient } from './apiClient.js';

export const inquiryService = {
  submitContactForm: async (formData) => {
    return apiClient('/inquiries', { body: formData });
  },

  getInquiries: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiClient(`/inquiries${query ? `?${query}` : ''}`);
  },

  getInquiryById: async (id) => {
    return apiClient(`/inquiries/${id}`);
  },

  updateStatus: async (id, status, internalNote = null) => {
    return apiClient(`/inquiries/${id}/status`, {
      method: 'PATCH',
      body: { status, internalNote },
    });
  },

  deleteInquiry: async (id) => {
    return apiClient(`/inquiries/${id}`, {
      method: 'DELETE',
    });
  },
};
