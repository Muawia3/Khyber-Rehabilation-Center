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

export const storyService = {
  getPublishedStories: async ({ featuredOnly = false } = {}) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const where = { isPublished: true, isConsentGiven: true };
        if (featuredOnly) {
          where.isFeatured = true;
        }
        return await prisma.successStory.findMany({
          where,
          orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        });
      } catch {
        // Fall through to localStore
      }
    }
    let items = localStore.getCollection('stories').filter((s) => s.isPublished && s.isConsentGiven);
    if (featuredOnly) {
      items = items.filter((s) => s.isFeatured);
    }
    return items;
  },

  getAllStories: async () => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.successStory.findMany({
          orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.getCollection('stories');
  },

  getStoryByIdOrSlug: async (idOrSlug) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.successStory.findFirst({
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
        .getCollection('stories')
        .find((s) => s.id === idOrSlug || s.slug === idOrSlug) || null
    );
  },

  createStory: async (data) => {
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title);
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.successStory.create({
          data: {
            title: data.title,
            slug,
            patientIdentifier: data.patientIdentifier || 'Center Alumnus',
            story: data.story || '',
            recoveryPeriod: data.recoveryPeriod || null,
            category: data.category || 'Substance Recovery',
            imageUrl: data.imageUrl || null,
            isConsentGiven: data.isConsentGiven !== undefined ? Boolean(data.isConsentGiven) : true,
            isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : false,
            isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
          },
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.addItem('stories', {
      title: data.title,
      slug,
      patientIdentifier: data.patientIdentifier || 'Center Alumnus',
      story: data.story || '',
      recoveryPeriod: data.recoveryPeriod || null,
      category: data.category || 'Substance Recovery',
      imageUrl: data.imageUrl || null,
      isConsentGiven: data.isConsentGiven !== undefined ? Boolean(data.isConsentGiven) : true,
      isFeatured: data.isFeatured !== undefined ? Boolean(data.isFeatured) : false,
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
    });
  },

  updateStory: async (id, data) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const updateData = { ...data };

        if (updateData.slug) {
          updateData.slug = generateSlug(updateData.slug);
        } else if (updateData.title && !updateData.slug) {
          updateData.slug = generateSlug(updateData.title);
        }

        if (updateData.isConsentGiven !== undefined) {
          updateData.isConsentGiven = Boolean(updateData.isConsentGiven);
        }
        if (updateData.isFeatured !== undefined) {
          updateData.isFeatured = Boolean(updateData.isFeatured);
        }
        if (updateData.isPublished !== undefined) {
          updateData.isPublished = Boolean(updateData.isPublished);
        }

        return await prisma.successStory.update({
          where: { id },
          data: updateData,
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.updateItem('stories', id, data);
  },

  deleteStory: async (id) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.successStory.delete({
          where: { id },
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.deleteItem('stories', id);
  },
};
