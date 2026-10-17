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

export const skillService = {
  getPublishedSkills: async () => {
    try {
      const prisma = getPrismaClient();
      return await prisma.skillProgram.findMany({
        where: { isPublished: true },
        orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
      });
    } catch {
      return localStore.getCollection('skills').filter((s) => s.isPublished);
    }
  },

  getAllSkills: async () => {
    try {
      const prisma = getPrismaClient();
      return await prisma.skillProgram.findMany({
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
      });
    } catch {
      return localStore.getCollection('skills');
    }
  },

  getSkillByIdOrSlug: async (idOrSlug) => {
    try {
      const prisma = getPrismaClient();
      return await prisma.skillProgram.findFirst({
        where: {
          OR: [{ id: idOrSlug }, { slug: idOrSlug }],
        },
      });
    } catch {
      return (
        localStore
          .getCollection('skills')
          .find((s) => s.id === idOrSlug || s.slug === idOrSlug) || null
      );
    }
  },

  createSkill: async (data) => {
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title);
    try {
      const prisma = getPrismaClient();
      return await prisma.skillProgram.create({
        data: {
          title: data.title,
          slug,
          description: data.description || '',
          category: data.category || 'General',
          duration: data.duration || null,
          order: data.order !== undefined ? parseInt(data.order, 10) : 0,
          isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        },
      });
    } catch {
      return localStore.addItem('skills', {
        title: data.title,
        slug,
        description: data.description || '',
        category: data.category || 'General',
        duration: data.duration || null,
        order: data.order !== undefined ? parseInt(data.order, 10) : 0,
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      });
    }
  },

  updateSkill: async (id, data) => {
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

      return await prisma.skillProgram.update({
        where: { id },
        data: updateData,
      });
    } catch {
      return localStore.updateItem('skills', id, data);
    }
  },

  deleteSkill: async (id) => {
    try {
      const prisma = getPrismaClient();
      return await prisma.skillProgram.delete({
        where: { id },
      });
    } catch {
      return localStore.deleteItem('skills', id);
    }
  },
};
