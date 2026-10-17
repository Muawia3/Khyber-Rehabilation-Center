import { apiClient } from './apiClient.js';

export const leadershipService = {
  // Public: Get published leadership tree
  getLeadershipTree: async () => {
    return apiClient('/leadership');
  },

  // Admin: Get all members with hierarchy relations & counts
  getAdminLeadership: async () => {
    return apiClient('/leadership/admin');
  },

  // Admin: Create member
  createMember: async (data) => {
    return apiClient('/leadership', { method: 'POST', body: data });
  },

  // Admin: Update member
  updateMember: async (id, data) => {
    return apiClient(`/leadership/${id}`, { method: 'PUT', body: data });
  },

  // Admin: Delete member
  deleteMember: async (id, force = false) => {
    const query = force ? '?force=true' : '';
    return apiClient(`/leadership/${id}${query}`, { method: 'DELETE' });
  },

  // Admin: Reorder
  reorderMembers: async (items) => {
    return apiClient('/leadership/reorder', { method: 'PUT', body: { items } });
  },
};
