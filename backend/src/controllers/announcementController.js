import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { announcementService } from '../services/announcementService.js';

export const getAnnouncements = async (req, res, next) => {
  try {
    const isAllRequested = req.query.all === 'true';
    const announcements = isAllRequested
      ? await announcementService.getAllAnnouncements()
      : await announcementService.getPublishedAnnouncements();

    return successResponse(res, announcements, 'Announcements retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getAnnouncementBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const announcement = await announcementService.getAnnouncementByIdOrSlug(slug);

    if (!announcement) {
      return errorResponse(res, 'Announcement not found', 404);
    }

    return successResponse(res, announcement, 'Announcement details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return errorResponse(res, 'Title and content are required', 400);
    }

    const created = await announcementService.createAnnouncement(req.body);
    return successResponse(res, created, 'Announcement created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await announcementService.updateAnnouncement(id, req.body);
    return successResponse(res, updated, 'Announcement updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteAnnouncement = async (req, res, next) => {
  try {
    const { id } = req.params;
    await announcementService.deleteAnnouncement(id);
    return successResponse(res, null, 'Announcement deleted successfully');
  } catch (error) {
    next(error);
  }
};
