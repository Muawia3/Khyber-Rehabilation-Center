import { apiClient } from './apiClient.js';

export const contentService = {
  checkHealth: async () => {
    return apiClient('/health');
  },

  getDashboardStats: async () => {
    return apiClient('/admin/dashboard');
  },

  // Treatments
  getTreatments: async (all = false) => {
    const query = all ? '?all=true' : '';
    return apiClient(`/treatments${query}`);
  },

  getTreatmentBySlug: async (slug) => {
    return apiClient(`/treatments/${slug}`);
  },

  createTreatment: async (data) => {
    return apiClient('/treatments', { body: data });
  },

  updateTreatment: async (id, data) => {
    return apiClient(`/treatments/${id}`, { method: 'PUT', body: data });
  },

  deleteTreatment: async (id) => {
    return apiClient(`/treatments/${id}`, { method: 'DELETE' });
  },

  // Skills
  getSkills: async (all = false) => {
    const query = all ? '?all=true' : '';
    return apiClient(`/skills${query}`);
  },

  getSkillBySlug: async (slug) => {
    return apiClient(`/skills/${slug}`);
  },

  createSkill: async (data) => {
    return apiClient('/skills', { body: data });
  },

  updateSkill: async (id, data) => {
    return apiClient(`/skills/${id}`, { method: 'PUT', body: data });
  },

  deleteSkill: async (id) => {
    return apiClient(`/skills/${id}`, { method: 'DELETE' });
  },

  // Business Initiatives
  getBusiness: async (all = false) => {
    const query = all ? '?all=true' : '';
    return apiClient(`/business${query}`);
  },

  getBusinessBySlug: async (slug) => {
    return apiClient(`/business/${slug}`);
  },

  createBusiness: async (data) => {
    return apiClient('/business', { body: data });
  },

  updateBusiness: async (id, data) => {
    return apiClient(`/business/${id}`, { method: 'PUT', body: data });
  },

  deleteBusiness: async (id) => {
    return apiClient(`/business/${id}`, { method: 'DELETE' });
  },

  // Products
  getProducts: async (category = null, all = false) => {
    const params = new URLSearchParams();
    if (category && category !== 'All') params.append('category', category);
    if (all) params.append('all', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient(`/products${query}`);
  },

  getProductBySlug: async (slug) => {
    return apiClient(`/products/${slug}`);
  },

  createProduct: async (data) => {
    return apiClient('/products', { body: data });
  },

  updateProduct: async (id, data) => {
    return apiClient(`/products/${id}`, { method: 'PUT', body: data });
  },

  deleteProduct: async (id) => {
    return apiClient(`/products/${id}`, { method: 'DELETE' });
  },

  // Success Stories
  getStories: async (featuredOnly = false, all = false) => {
    const params = new URLSearchParams();
    if (featuredOnly) params.append('featured', 'true');
    if (all) params.append('all', 'true');
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient(`/stories${query}`);
  },

  getStoryBySlug: async (slug) => {
    return apiClient(`/stories/${slug}`);
  },

  createStory: async (data) => {
    return apiClient('/stories', { body: data });
  },

  updateStory: async (id, data) => {
    return apiClient(`/stories/${id}`, { method: 'PUT', body: data });
  },

  deleteStory: async (id) => {
    return apiClient(`/stories/${id}`, { method: 'DELETE' });
  },

  // Site Content
  getSiteContent: async (section = null) => {
    const query = section ? `?section=${encodeURIComponent(section)}` : '';
    return apiClient(`/content${query}`);
  },

  getRawSiteContent: async (section = null) => {
    const params = new URLSearchParams({ raw: 'true' });
    if (section && section !== 'All') params.append('section', section);
    return apiClient(`/content?${params.toString()}`);
  },

  upsertContent: async (data) => {
    return apiClient('/content', { body: data });
  },

  deleteContent: async (key) => {
    return apiClient(`/content/${encodeURIComponent(key)}`, { method: 'DELETE' });
  },

  uploadImage: async (base64Image, filename = '') => {
    return apiClient('/content/upload', {
      method: 'POST',
      body: { image: base64Image, filename },
    });
  },

  // Announcements
  getAnnouncements: async (all = false) => {
    const query = all ? '?all=true' : '';
    return apiClient(`/announcements${query}`);
  },

  getAnnouncementBySlug: async (slug) => {
    return apiClient(`/announcements/${slug}`);
  },

  createAnnouncement: async (data) => {
    return apiClient('/announcements', { body: data });
  },

  updateAnnouncement: async (id, data) => {
    return apiClient(`/announcements/${id}`, { method: 'PUT', body: data });
  },

  deleteAnnouncement: async (id) => {
    return apiClient(`/announcements/${id}`, { method: 'DELETE' });
  },
};
