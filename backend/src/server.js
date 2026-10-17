import app from './app.js';
import { config, connectDatabase, disconnectDatabase } from './config/index.js';
import { logger } from './utils/logger.js';

const startServer = async () => {
  // Initialize database connection
  await connectDatabase();

  const server = app.listen(config.port, () => {
    logger.info(`Server running in ${config.env} mode on http://localhost:${config.port}`);
    logger.info(`Health check available at http://localhost:${config.port}/api/v1/health`);
  });

  // Graceful shutdown handling
  const shutdown = async (signal) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      logger.info('HTTP server and database connections closed.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
};

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
