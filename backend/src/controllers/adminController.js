import { successResponse } from '../utils/apiResponse.js';
import { adminService } from '../services/adminService.js';

export const getDashboardOverview = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    return successResponse(res, stats, 'Dashboard statistics retrieved');
  } catch (error) {
    next(error);
  }
};
