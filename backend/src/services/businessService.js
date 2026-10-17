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

export const businessService = {
  getPublishedInitiatives: async () => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.businessInitiative.findMany({
          where: { isPublished: true },
          orderBy: { createdAt: 'asc' },
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.getCollection('business').filter((b) => b.isPublished);
  },

  getAllInitiatives: async () => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.businessInitiative.findMany({
          orderBy: { createdAt: 'desc' },
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.getCollection('business');
  },

  getInitiativeByIdOrSlug: async (idOrSlug) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.businessInitiative.findFirst({
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
        .getCollection('business')
        .find((b) => b.id === idOrSlug || b.slug === idOrSlug) || null
    );
  },

  createInitiative: async (data) => {
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name);
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.businessInitiative.create({
          data: {
            name: data.name,
            slug,
            description: data.description || '',
            category: data.category || 'General',
            contactPerson: data.contactPerson || null,
            contactPhone: data.contactPhone || null,
            isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
          },
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.addItem('business', {
      name: data.name,
      slug,
      description: data.description || '',
      category: data.category || 'General',
      contactPerson: data.contactPerson || null,
      contactPhone: data.contactPhone || null,
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
    });
  },

  updateInitiative: async (id, data) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const updateData = { ...data };

        if (updateData.slug) {
          updateData.slug = generateSlug(updateData.slug);
        } else if (updateData.name && !updateData.slug) {
          updateData.slug = generateSlug(updateData.name);
        }

        if (updateData.isPublished !== undefined) {
          updateData.isPublished = Boolean(updateData.isPublished);
        }

        return await prisma.businessInitiative.update({
          where: { id },
          data: updateData,
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.updateItem('business', id, data);
  },

  deleteInitiative: async (id) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.businessInitiative.delete({
          where: { id },
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.deleteItem('business', id);
  },
};
