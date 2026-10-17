import { getPrismaClient, isDatabaseConnected } from '../config/database.js';
import { localStore } from '../utils/localStore.js';

const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const announcementService = {
  getPublishedAnnouncements: async () => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const now = new Date();

        return await prisma.announcement.findMany({
          where: {
            isPublished: true,
            OR: [
              { endDate: null },
              { endDate: { gte: now } },
            ],
          },
          orderBy: { publishedAt: 'desc' },
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.getCollection('announcements').filter((a) => a.isPublished);
  },

  getAllAnnouncements: async () => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.announcement.findMany({
          orderBy: { createdAt: 'desc' },
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.getCollection('announcements');
  },

  getAnnouncementByIdOrSlug: async (idOrSlug) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.announcement.findFirst({
          where: {
            OR: [{ id: idOrSlug }, { slug: idOrSlug }],
          },
        });
      } catch {
        // Fall through to localStore
      }
    }
    return (
      localStore
        .getCollection('announcements')
        .find((a) => a.id === idOrSlug || a.slug === idOrSlug) || null
    );
  },

  createAnnouncement: async (data) => {
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title);
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.announcement.create({
          data: {
            title: data.title,
            slug,
            content: data.content || '',
            category: data.category || 'General',
            imageUrl: data.imageUrl || null,
            startDate: data.startDate ? new Date(data.startDate) : null,
            endDate: data.endDate ? new Date(data.endDate) : null,
            isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
          },
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.addItem('announcements', {
      title: data.title,
      slug,
      content: data.content || '',
      category: data.category || 'General',
      imageUrl: data.imageUrl || null,
      startDate: data.startDate || null,
      endDate: data.endDate || null,
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
    });
  },

  updateAnnouncement: async (id, data) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const updateData = { ...data };

        if (updateData.slug) {
          updateData.slug = generateSlug(updateData.slug);
        } else if (updateData.title && !updateData.slug) {
          updateData.slug = generateSlug(updateData.title);
        }

        if (updateData.startDate !== undefined) {
          updateData.startDate = updateData.startDate ? new Date(updateData.startDate) : null;
        }
        if (updateData.endDate !== undefined) {
          updateData.endDate = updateData.endDate ? new Date(updateData.endDate) : null;
        }
        if (updateData.isPublished !== undefined) {
          updateData.isPublished = Boolean(updateData.isPublished);
        }

        return await prisma.announcement.update({
          where: { id },
          data: updateData,
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.updateItem('announcements', id, data);
  },

  deleteAnnouncement: async (id) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.announcement.delete({
          where: { id },
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.deleteItem('announcements', id);
  },
};
