import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { treatmentService } from '../services/treatmentService.js';

export const getTreatments = async (req, res, next) => {
  try {
    const isAllRequested = req.query.all === 'true';
    const treatments = isAllRequested
      ? await treatmentService.getAllTreatments()
      : await treatmentService.getPublishedTreatments();

    return successResponse(res, treatments, 'Treatments retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const getTreatmentBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const treatment = await treatmentService.getTreatmentByIdOrSlug(slug);

    if (!treatment) {
      return errorResponse(res, 'Treatment program not found', 404);
    }

    return successResponse(res, treatment, 'Treatment details retrieved successfully');
  } catch (error) {
    next(error);
  }
};

export const createTreatment = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return errorResponse(res, 'Title and description are required', 400);
    }

    const treatment = await treatmentService.createTreatment(req.body);
    return successResponse(res, treatment, 'Treatment program created successfully', 201);
  } catch (error) {
    next(error);
  }
};

export const updateTreatment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const treatment = await treatmentService.updateTreatment(id, req.body);
    return successResponse(res, treatment, 'Treatment program updated successfully');
  } catch (error) {
    next(error);
  }
};

export const deleteTreatment = async (req, res, next) => {
  try {
    const { id } = req.params;
    await treatmentService.deleteTreatment(id);
    return successResponse(res, null, 'Treatment program deleted successfully');
  } catch (error) {
    next(error);
  }
};
