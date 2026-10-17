import { successResponse } from '../utils/apiResponse.js';
import { checkDatabaseHealth } from '../config/database.js';

export const getHealth = async (req, res, next) => {
  try {
    const dbHealth = await checkDatabaseHealth();

    const data = {
      status: 'online',
      service: 'Khyber Rehabilitation Center API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: dbHealth,
    };

    return successResponse(res, data, 'API service health check passed');
  } catch (error) {
    next(error);
  }
};
