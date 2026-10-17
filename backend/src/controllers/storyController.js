import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { storyService } from '../services/storyService.js';

export const getStories = async (req, res, next) => {
  try {
    const { featured, all } = req.query;
    const isAllRequested = all === 'true';

    const stories = isAllRequested
      ? await storyService.getAllStories()
      : await storyService.getPublishedStories({ featuredOnly: featured === 'true' });

    return successResponse(res, stories, 'Success stories retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getStoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const story = await storyService.getStoryByIdOrSlug(slug);

    if (!story) {
      return errorResponse(res, 'Success story not found', 404);
    }

    return successResponse(res, story, 'Success story details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createStory = async (req, res, next) => {
  try {
    const { title, story } = req.body;
    if (!title || !story) {
      return errorResponse(res, 'Title and story text are required', 400);
    }

    const created = await storyService.createStory(req.body);
    return successResponse(res, created, 'Success story created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updated = await storyService.updateStory(id, req.body);
    return successResponse(res, updated, 'Success story updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteStory = async (req, res, next) => {
  try {
    const { id } = req.params;
    await storyService.deleteStory(id);
    return successResponse(res, null, 'Success story deleted successfully');
  } catch (error) {
    next(error);
  }
};
