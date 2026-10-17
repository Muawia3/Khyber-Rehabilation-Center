import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getPrismaClient, isDatabaseConnected } from '../config/database.js';
import { config } from '../config/environment.js';

export const authService = {
  /**
   * Authenticate admin user with email and password
   */
  login: async ({ email, password }) => {
    const inputEmail = (email || '').trim().toLowerCase();
    const inputPassword = password || '';

    // 1. First attempt to authenticate against live PostgreSQL database if online
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const admin = await prisma.adminUser.findFirst({
          where: {
            email: { equals: inputEmail, mode: 'insensitive' },
          },
        });

      if (admin) {
        if (!admin.isActive) {
          const error = new Error('Account has been deactivated. Please contact the administrator.');
          error.statusCode = 403;
          throw error;
        }

        const isPasswordValid = await bcrypt.compare(inputPassword, admin.passwordHash);
        if (!isPasswordValid) {
          const error = new Error('Invalid email or password');
          error.statusCode = 401;
          throw error;
        }

        // Update last login timestamp
        try {
          await prisma.adminUser.update({
            where: { id: admin.id },
            data: { lastLoginAt: new Date() },
          });
        } catch {
          // Non-critical if update fails
        }

        const tokenPayload = {
          id: admin.id,
          email: admin.email,
          fullName: admin.fullName,
          role: admin.role,
        };

        const token = jwt.sign(tokenPayload, config.jwt.secret, {
          expiresIn: config.jwt.expiresIn,
        });

        return {
          token,
          user: {
            id: admin.id,
            email: admin.email,
            fullName: admin.fullName,
            role: admin.role,
            lastLoginAt: admin.lastLoginAt,
          },
        };
      }
    } catch (dbError) {
      if (dbError.statusCode === 401 || dbError.statusCode === 403) {
        throw dbError;
      }
      // If database is disconnected or unavailable, fall through to check configured credentials
    }
  }

    // 2. Initial Admin authentication fallback using configured environment credentials
    if (
      inputEmail === config.initialAdmin.email &&
      inputPassword === config.initialAdmin.password
    ) {
      const tokenPayload = {
        id: 'initial-admin-master-001',
        email: config.initialAdmin.email,
        fullName: config.initialAdmin.name,
        role: 'SUPERADMIN',
      };

      const token = jwt.sign(tokenPayload, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn,
      });

      return {
        token,
        user: {
          id: 'initial-admin-master-001',
          email: config.initialAdmin.email,
          fullName: config.initialAdmin.name,
          role: 'SUPERADMIN',
          lastLoginAt: new Date(),
        },
      };
    }

    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  },

  /**
   * Retrieve currently authenticated admin profile
   */
  getCurrentAdmin: async (adminId, decodedUser = null) => {
    if (!adminId) {
      const error = new Error('Unauthorized');
      error.statusCode = 401;
      throw error;
    }

    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const admin = await prisma.adminUser.findUnique({
          where: { id: adminId },
          select: {
            id: true,
            email: true,
            fullName: true,
            role: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true,
          },
        });

        if (admin) {
          if (!admin.isActive) {
            const error = new Error('Admin profile not found or inactive');
            error.statusCode = 404;
            throw error;
          }
          return admin;
        }
      } catch (dbError) {
        if (dbError.statusCode) throw dbError;
        // In case database has error, fall through to check initial admin
      }
    }

    if (
      adminId === 'initial-admin-master-001' ||
      (decodedUser && decodedUser.email === config.initialAdmin.email)
    ) {
      return {
        id: 'initial-admin-master-001',
        email: config.initialAdmin.email,
        fullName: config.initialAdmin.name,
        role: 'SUPERADMIN',
        isActive: true,
        createdAt: new Date(),
      };
    }

    const error = new Error('Admin profile not found or inactive');
    error.statusCode = 404;
    throw error;
  },
};
