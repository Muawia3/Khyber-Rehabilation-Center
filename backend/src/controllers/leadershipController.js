import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { leadershipService } from '../services/leadershipService.js';

export const getLeadershipTree = async (req, res, next) => {
  try {
    const data = await leadershipService.getPublishedTree();
    return successResponse(res, data, 'Leadership hierarchy retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getLeadershipForAdmin = async (req, res, next) => {
  try {
    const data = await leadershipService.getAllForAdmin();
    return successResponse(res, data, 'Admin leadership members retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createLeadershipMember = async (req, res, next) => {
  try {
    const { name, designation, photo } = req.body;
    if (!name || !name.trim()) {
      return errorResponse(res, 'Member full name is required', 400);
    }
    if (!designation || !designation.trim()) {
      return errorResponse(res, 'Designation / role is required', 400);
    }

    // Image format validation if provided
    if (photo && typeof photo === 'string') {
      const isUrl = photo.startsWith('http://') || photo.startsWith('https://') || photo.startsWith('/');
      const isBase64 = photo.startsWith('data:image/');
      if (!isUrl && !isBase64) {
        return errorResponse(res, 'Invalid photo format. Must be an image URL or base64 image data.', 400);
      }
    }

    const member = await leadershipService.createMember(req.body);
    return successResponse(res, member, 'Leadership member created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateLeadershipMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { photo } = req.body;

    if (photo && typeof photo === 'string') {
      const isUrl = photo.startsWith('http://') || photo.startsWith('https://') || photo.startsWith('/');
      const isBase64 = photo.startsWith('data:image/');
      if (!isUrl && !isBase64) {
        return errorResponse(res, 'Invalid photo format. Must be an image URL or base64 image data.', 400);
      }
    }

    const member = await leadershipService.updateMember(id, req.body);
    return successResponse(res, member, 'Leadership member updated successfully');
  } catch (error) {
    if (error.statusCode === 400) {
      return errorResponse(res, error.message, 400);
    }
    next(error);
  }
};

export const deleteLeadershipMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const force = req.query.force === 'true' || req.body?.force === true;

    await leadershipService.deleteMember(id, force);
    return successResponse(res, null, 'Leadership member deleted successfully');
  } catch (error) {
    if (error.statusCode === 409) {
      return errorResponse(res, error.message, 409, { childCount: error.childCount });
    }
    next(error);
  }
};

export const reorderLeadershipMembers = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return errorResponse(res, 'Items array is required for reordering', 400);
    }
    const result = await leadershipService.reorderMembers(items);
    return successResponse(res, result, 'Leadership hierarchy reordered successfully');
  } catch (error) {
    next(error);
  }
};
