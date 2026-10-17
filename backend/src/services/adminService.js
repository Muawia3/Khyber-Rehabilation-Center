import { getPrismaClient, isDatabaseConnected } from '../config/database.js';
import { localStore } from '../utils/localStore.js';

export const adminService = {
  getDashboardStats: async () => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();

        const [
          totalInquiries,
          pendingInquiries,
          treatmentCount,
          skillCount,
          businessCount,
          productCount,
          publishedProductCount,
          announcementCount,
          storyCount,
          recentInquiries,
        ] = await Promise.all([
          prisma.inquiry.count(),
          prisma.inquiry.count({ where: { status: 'PENDING' } }),
          prisma.treatment.count(),
          prisma.skillProgram.count(),
          prisma.businessInitiative.count(),
          prisma.product.count(),
          prisma.product.count({ where: { isPublished: true } }),
          prisma.announcement.count({ where: { isPublished: true } }),
          prisma.successStory.count({ where: { isPublished: true } }),
          prisma.inquiry.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
              id: true,
              fullName: true,
              phone: true,
              email: true,
              inquiryType: true,
              status: true,
              createdAt: true,
            },
          }),
        ]);

        return {
          metrics: {
            totalInquiries,
            pendingInquiries,
            treatmentPrograms: treatmentCount,
            skillPrograms: skillCount,
            businessInitiatives: businessCount,
            totalProducts: productCount,
            publishedProducts: publishedProductCount,
            activeAnnouncements: announcementCount,
            successStories: storyCount,
          },
          recentInquiries,
        };
      } catch (error) {
        console.warn('[AdminService] Database stats failed, falling back to localStore:', error.message);
      }
    }
      // Graceful localStore fallback when PostgreSQL is not running or unreachable
      const inquiries = localStore.getCollection('inquiries') || [];
      const treatments = localStore.getCollection('treatments') || [];
      const skills = localStore.getCollection('skills') || [];
      const businesses = localStore.getCollection('business') || [];
      const products = localStore.getCollection('products') || [];
      const announcements = localStore.getCollection('announcements') || [];
      const stories = localStore.getCollection('stories') || [];

      return {
        metrics: {
          totalInquiries: inquiries.length,
          pendingInquiries: inquiries.filter((i) => i.status === 'PENDING').length,
          treatmentPrograms: treatments.length,
          skillPrograms: skills.length,
          businessInitiatives: businesses.length,
          totalProducts: products.length,
          publishedProducts: products.filter((p) => p.isPublished).length,
          activeAnnouncements: announcements.filter((a) => a.isPublished).length,
          successStories: stories.filter((s) => s.isPublished).length,
        },
        recentInquiries: inquiries.slice(0, 5).map((i) => ({
          id: i.id,
          fullName: i.fullName,
          phone: i.phone,
          email: i.email,
          inquiryType: i.inquiryType,
          status: i.status,
          createdAt: i.createdAt,
        })),
      };
  },
};

