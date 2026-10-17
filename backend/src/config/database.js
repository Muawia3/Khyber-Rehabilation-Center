import { PrismaClient } from '@prisma/client';

let prismaInstance = null;
let isDbConnected = false;

export const getPrismaClient = () => {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    });
  }
  return prismaInstance;
};

export const isDatabaseConnected = () => isDbConnected;

let lastHealthCheck = 0;
let cachedHealthResult = {
  status: 'disconnected',
  message: 'PostgreSQL connection pending setup or credentials',
};

export const checkDatabaseHealth = async (force = false) => {
  const now = Date.now();
  // Return cached disconnected result if checked within the last 15s to keep API responses instant
  if (!force && !isDbConnected && now - lastHealthCheck < 15000) {
    return cachedHealthResult;
  }

  lastHealthCheck = now;
  try {
    const prisma = getPrismaClient();
    // Probe with 1200ms timeout so slow or offline PostgreSQL doesn't block the API
    await Promise.race([
      prisma.$queryRaw`SELECT 1`,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Database probe timeout')), 1200)
      ),
    ]);
    isDbConnected = true;
    cachedHealthResult = {
      status: 'connected',
      message: 'PostgreSQL database connected',
    };
    return cachedHealthResult;
  } catch (error) {
    isDbConnected = false;
    cachedHealthResult = {
      status: 'disconnected',
      message: 'PostgreSQL connection pending setup or credentials',
      error: error.message,
    };
    return cachedHealthResult;
  }
};

export const connectDatabase = async () => {
  try {
    const prisma = getPrismaClient();
    await prisma.$connect();
    isDbConnected = true;
    console.log('[Database] PostgreSQL connection established successfully via Prisma.');
  } catch (error) {
    isDbConnected = false;
    console.warn('[Database] Prisma connection pending database startup or credentials (local storage active).');
  }
};

export const disconnectDatabase = async () => {
  if (prismaInstance) {
    await prismaInstance.$disconnect();
    isDbConnected = false;
    console.log('[Database] Disconnected Prisma Client.');
  }
};
