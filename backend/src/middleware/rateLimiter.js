import rateLimit from 'express-rate-limit';
import { config } from '../config/environment.js';
import { errorResponse } from '../utils/apiResponse.js';

export const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.env === 'development' ? 2000 : config.rateLimit.maxGeneral,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(res, 'Too many requests. Please try again later.', 429);
  },
});

export const inquiryLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxInquiries,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return errorResponse(
      res,
      'Too many inquiries submitted from this connection. For urgent care, please call the center helpline.',
      429
    );
  },
});
