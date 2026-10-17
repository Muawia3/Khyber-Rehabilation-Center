import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { businessService } from '../services/businessService.js';

export const getBusiness = async (req, res, next) => {
  try {
    const isAllRequested = req.query.all === 'true';
    const initiatives = isAllRequested
      ? await businessService.getAllInitiatives()
      : await businessService.getPublishedInitiatives();

    return successResponse(res, initiatives, 'Business initiatives retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getBusinessBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const initiative = await businessService.getInitiativeByIdOrSlug(slug);

    if (!initiative) {
      return errorResponse(res, 'Business initiative not found', 404);
    }

    return successResponse(res, initiative, 'Business initiative details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createBusiness = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name || !description) {
      return errorResponse(res, 'Name and description are required', 400);
    }

    const initiative = await businessService.createInitiative(req.body);
    return successResponse(res, initiative, 'Business initiative created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;
    const initiative = await businessService.updateInitiative(id, req.body);
    return successResponse(res, initiative, 'Business initiative updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteBusiness = async (req, res, next) => {
  try {
    const { id } = req.params;
    await businessService.deleteInitiative(id);
    return successResponse(res, null, 'Business initiative deleted successfully');
  } catch (error) {
    next(error);
  }
};
