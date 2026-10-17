import { getPrismaClient, isDatabaseConnected } from '../config/database.js';
import { localStore } from '../utils/localStore.js';

export const inquiryService = {
  createInquiry: async (inquiryData, ipAddress = null) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.inquiry.create({
          data: {
            fullName: inquiryData.fullName,
            phone: inquiryData.phone,
            email: inquiryData.email || null,
            inquiryType: inquiryData.inquiryType || 'General Information',
            message: inquiryData.message,
            ipAddress: ipAddress,
            status: 'PENDING',
          },
          select: {
            id: true,
            fullName: true,
            inquiryType: true,
            status: true,
            createdAt: true,
          },
        });
      } catch (err) {
        console.warn('[InquiryService] Database create failed, using localStore fallback:', err.message);
      }
    }

    // Resilient local persistence when PostgreSQL server is offline
    const newInquiry = localStore.addItem('inquiries', {
      fullName: inquiryData.fullName,
      phone: inquiryData.phone,
      email: inquiryData.email || null,
      inquiryType: inquiryData.inquiryType || 'General Information',
      message: inquiryData.message,
      ipAddress: ipAddress,
      status: 'PENDING',
      internalNote: null,
    });

    return {
      id: newInquiry.id,
      fullName: newInquiry.fullName,
      inquiryType: newInquiry.inquiryType,
      status: newInquiry.status,
      createdAt: newInquiry.createdAt,
    };
  },

  getAllInquiries: async ({ status, search, limit = 50, page = 1 } = {}) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const where = {};

        if (status && status !== 'ALL') {
          where.status = status;
        }

        if (search && search.trim()) {
          const term = search.trim();
          where.OR = [
            { fullName: { contains: term, mode: 'insensitive' } },
            { phone: { contains: term, mode: 'insensitive' } },
            { email: { contains: term, mode: 'insensitive' } },
            { inquiryType: { contains: term, mode: 'insensitive' } },
          ];
        }

        const skip = (page - 1) * limit;

        const [inquiries, total] = await Promise.all([
          prisma.inquiry.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
          }),
          prisma.inquiry.count({ where }),
        ]);

        return { inquiries, total, page, limit };
      } catch (err) {
        console.warn('[InquiryService] Database getAllInquiries failed, using localStore fallback:', err.message);
      }
    }

    let inquiries = localStore.getCollection('inquiries');
    if (status && status !== 'ALL') {
      inquiries = inquiries.filter((i) => i.status === status);
    }
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      inquiries = inquiries.filter(
        (i) =>
          i.fullName?.toLowerCase().includes(term) ||
          i.phone?.toLowerCase().includes(term) ||
          i.email?.toLowerCase().includes(term) ||
          i.inquiryType?.toLowerCase().includes(term)
      );
    }
    const total = inquiries.length;
    const skip = (page - 1) * limit;
    const paginated = inquiries.slice(skip, skip + limit);
    return { inquiries: paginated, total, page, limit };
  },

  getInquiryById: async (id) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.inquiry.findUnique({
          where: { id: String(id) },
        });
      } catch (err) {
        console.warn('[InquiryService] Database getInquiryById failed, using localStore fallback:', err.message);
      }
    }
    return localStore.getCollection('inquiries').find((i) => String(i.id) === String(id)) || null;
  },

  updateInquiryStatus: async (id, status, internalNote = null) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const data = { status };
        if (internalNote !== null && internalNote !== undefined) {
          data.internalNote = internalNote;
        }
        return await prisma.inquiry.update({
          where: { id: String(id) },
          data,
        });
      } catch (err) {
        console.warn('[InquiryService] Database updateInquiryStatus failed, using localStore fallback:', err.message);
      }
    }

    const updates = { status };
    if (internalNote !== null && internalNote !== undefined) {
      updates.internalNote = internalNote;
    }
    return localStore.updateItem('inquiries', id, updates);
  },

  deleteInquiry: async (id) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.inquiry.delete({
          where: { id: String(id) },
        });
      } catch (err) {
        console.warn('[InquiryService] Database deleteInquiry failed, using localStore fallback:', err.message);
      }
    }
    return localStore.deleteItem('inquiries', id);
  },
};
