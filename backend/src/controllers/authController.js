import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { authService } from '../services/authService.js';

export const loginAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login({ email, password });
    return successResponse(res, result, 'Login successful');
  } catch (error) {
    next(error);
  }
};

export const getCurrentAdmin = async (req, res, next) => {
  try {
    const admin = await authService.getCurrentAdmin(req.user?.id, req.user);
    return successResponse(res, admin, 'Admin profile retrieved');
  } catch (error) {
    next(error);
  }
};

export const logoutAdmin = async (req, res, next) => {
  try {
    return successResponse(res, null, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};
