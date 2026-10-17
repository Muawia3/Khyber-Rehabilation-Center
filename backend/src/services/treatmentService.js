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

export const treatmentService = {
  getPublishedTreatments: async () => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.treatment.findMany({
          where: { isPublished: true },
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.getCollection('treatments').filter((t) => t.isPublished);
  },

  getAllTreatments: async () => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.treatment.findMany({
          orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.getCollection('treatments');
  },

  getTreatmentByIdOrSlug: async (idOrSlug) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.treatment.findFirst({
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
        .getCollection('treatments')
        .find((t) => t.id === idOrSlug || t.slug === idOrSlug) || null
    );
  },

  createTreatment: async (data) => {
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title);
    try {
      const prisma = getPrismaClient();
      return await prisma.treatment.create({
        data: {
          title: data.title,
          slug,
          summary: data.summary || '',
          description: data.description || '',
          category: data.category || 'Inpatient',
          icon: data.icon || null,
          imageUrl: data.imageUrl || null,
          order: data.order !== undefined ? parseInt(data.order, 10) : 0,
          isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        },
      });
    } catch {
      return localStore.addItem('treatments', {
        title: data.title,
        slug,
        summary: data.summary || '',
        description: data.description || '',
        category: data.category || 'Inpatient',
        imageUrl: data.imageUrl || null,
        order: data.order !== undefined ? parseInt(data.order, 10) : 0,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      });
    }
  },

  updateTreatment: async (id, data) => {
    try {
      const prisma = getPrismaClient();
      const updateData = { ...data };

      if (updateData.slug) {
        updateData.slug = generateSlug(updateData.slug);
      } else if (updateData.title && !updateData.slug) {
        updateData.slug = generateSlug(updateData.title);
      }

      if (updateData.order !== undefined) {
        updateData.order = parseInt(updateData.order, 10);
      }
      if (updateData.isPublished !== undefined) {
        updateData.isPublished = Boolean(updateData.isPublished);
      }

      return await prisma.treatment.update({
        where: { id },
        data: updateData,
      });
    } catch {
      return localStore.updateItem('treatments', id, data);
    }
  },

  deleteTreatment: async (id) => {
    try {
      const prisma = getPrismaClient();
      return await prisma.treatment.delete({
        where: { id },
      });
    } catch {
      return localStore.deleteItem('treatments', id);
    }
  },
};
