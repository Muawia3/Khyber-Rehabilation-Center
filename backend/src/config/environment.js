import dotenv from 'dotenv';
dotenv.config();

const getEnvNumber = (key, fallback) => {
  const value = process.env[key];
  return value && !isNaN(value) ? parseInt(value, 10) : fallback;
};

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: getEnvNumber('PORT', 5000),
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    secret: process.env.JWT_SECRET || 'super_secret_jwt_key_khyber_rehab',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  rateLimit: {
    windowMs: getEnvNumber(
      'RATE_LIMIT_WINDOW_MS',
      getEnvNumber('RATE_LIMIT_WINDOW_MINUTES', 15) * 60 * 1000
    ),
    maxGeneral: getEnvNumber('RATE_LIMIT_MAX_REQUESTS', 100),
    maxInquiries: getEnvNumber(
      'INQUIRY_RATE_LIMIT_MAX',
      getEnvNumber('RATE_LIMIT_MAX_INQUIRIES', 10)
    ),
  },
  initialAdmin: {
    email: (process.env.INITIAL_ADMIN_EMAIL || 'admin@khyberrehab.org').toLowerCase().trim(),
    password: process.env.INITIAL_ADMIN_PASSWORD || 'Admin@12345',
    name: process.env.INITIAL_ADMIN_NAME || 'Super Administrator',
  },
};
