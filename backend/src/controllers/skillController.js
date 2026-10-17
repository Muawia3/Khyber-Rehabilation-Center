import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { skillService } from '../services/skillService.js';

export const getSkills = async (req, res, next) => {
  try {
    const isAllRequested = req.query.all === 'true';
    const skills = isAllRequested
      ? await skillService.getAllSkills()
      : await skillService.getPublishedSkills();

    return successResponse(res, skills, 'Skills programs retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getSkillBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const skill = await skillService.getSkillByIdOrSlug(slug);

    if (!skill) {
      return errorResponse(res, 'Skill program not found', 404);
    }

    return successResponse(res, skill, 'Skill program details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createSkill = async (req, res, next) => {
  try {
    const { title, description, category } = req.body;
    if (!title || !description || !category) {
      return errorResponse(res, 'Title, category, and description are required', 400);
    }

    const skill = await skillService.createSkill(req.body);
    return successResponse(res, skill, 'Skill program created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    const skill = await skillService.updateSkill(id, req.body);
    return successResponse(res, skill, 'Skill program updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteSkill = async (req, res, next) => {
  try {
    const { id } = req.params;
    await skillService.deleteSkill(id);
    return successResponse(res, null, 'Skill program deleted successfully');
  } catch (error) {
    next(error);
  }
};
