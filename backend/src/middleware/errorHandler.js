import { errorResponse } from '../utils/apiResponse.js';
import { logger } from '../utils/logger.js';

/**
 * Centralized Global Error Handler Middleware
 * Handles application, validation, and Prisma database exceptions
 */
export const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`);

  // Prisma connection error
  if (err.code === 'P1001' || err.name === 'PrismaClientInitializationError') {
    return errorResponse(
      res,
      'Database service is currently unreachable. Please check PostgreSQL server status and credentials.',
      503
    );
  }

  // Prisma unique constraint violation
  if (err.code === 'P2002') {
    const fields = err.meta?.target ? err.meta.target.join(', ') : 'field';
    return errorResponse(res, `A record with this ${fields} already exists.`, 409);
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return errorResponse(res, 'The requested record could not be found.', 404);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  return errorResponse(
    res,
    message,
    statusCode,
    process.env.NODE_ENV === 'development' ? err.stack : null
  );
};
