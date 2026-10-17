import { errorResponse } from '../utils/apiResponse.js';

/**
 * Request validation and sanitization runner middleware
 */
export const validateRequest = (validatorFn) => {
  return (req, res, next) => {
    const { isValid, errors, data } = validatorFn(req.body);
    if (!isValid) {
      return errorResponse(res, 'Validation failed. Please correct the highlighted errors.', 422, errors);
    }
    if (data) {
      req.body = { ...req.body, ...data };
    }
    next();
  };
};
