import jwt from 'jsonwebtoken';
import { errorResponse } from '../utils/apiResponse.js';
import { config } from '../config/environment.js';

/**
 * Authentication Middleware
 * Enforces JWT verification for protected admin endpoints
 */
export const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(
      res,
      'Authentication token required. Please sign in to access management portal.',
      401
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return errorResponse(res, 'Session token has expired. Please sign in again.', 401);
    }
    return errorResponse(res, 'Invalid authentication token.', 401);
  }
};

/**
 * Role-Based Access Control Middleware (optional superadmin restriction)
 */
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'SUPERADMIN') {
    return errorResponse(res, 'Forbidden: Higher privilege required', 403);
  }
  next();
};
