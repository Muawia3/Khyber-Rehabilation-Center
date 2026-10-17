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

export const productService = {
  getPublishedProducts: async ({ category } = {}) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const where = { isPublished: true };
        if (category && category !== 'All') {
          where.category = category;
        }
        return await prisma.product.findMany({
          where,
          orderBy: { createdAt: 'desc' },
        });
      } catch {
        // Fall through to localStore
      }
    }
    let items = localStore.getCollection('products').filter((p) => p.isPublished);
    if (category && category !== 'All') {
      items = items.filter((p) => p.category === category);
    }
    return items;
  },

  getAllProducts: async ({ category } = {}) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const where = {};
        if (category && category !== 'All') {
          where.category = category;
        }
        return await prisma.product.findMany({
          where,
          orderBy: { createdAt: 'desc' },
        });
      } catch {
        // Fall through to localStore
      }
    }
    let items = localStore.getCollection('products');
    if (category && category !== 'All') {
      items = items.filter((p) => p.category === category);
    }
    return items;
  },

  getProductByIdOrSlug: async (idOrSlug) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.product.findFirst({
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
        .getCollection('products')
        .find((p) => p.id === idOrSlug || p.slug === idOrSlug) || null
    );
  },

  createProduct: async (data) => {
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name);
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.product.create({
          data: {
            name: data.name,
            slug,
            description: data.description || null,
            price: data.price ? parseFloat(data.price) : null,
            category: data.category || 'Crafts',
            workshop: data.workshop || null,
            imageUrl: data.imageUrl || null,
            isAvailable: data.isAvailable !== undefined ? Boolean(data.isAvailable) : true,
            isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
          },
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.addItem('products', {
      name: data.name,
      slug,
      description: data.description || null,
      price: data.price ? parseFloat(data.price) : null,
      category: data.category || 'Crafts',
      workshop: data.workshop || null,
      imageUrl: data.imageUrl || null,
      isAvailable: data.isAvailable !== undefined ? Boolean(data.isAvailable) : true,
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
    });
  },

  updateProduct: async (id, data) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const updateData = { ...data };

        if (updateData.slug) {
          updateData.slug = generateSlug(updateData.slug);
        } else if (updateData.name && !updateData.slug) {
          updateData.slug = generateSlug(updateData.name);
        }

        if (updateData.price !== undefined) {
          updateData.price = updateData.price ? parseFloat(updateData.price) : null;
        }
        if (updateData.isAvailable !== undefined) {
          updateData.isAvailable = Boolean(updateData.isAvailable);
        }
        if (updateData.isPublished !== undefined) {
          updateData.isPublished = Boolean(updateData.isPublished);
        }

        return await prisma.product.update({
          where: { id },
          data: updateData,
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.updateItem('products', id, data);
  },

  deleteProduct: async (id) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.product.delete({
          where: { id },
        });
      } catch {
        // Fall through to localStore
      }
    }
    return localStore.deleteItem('products', id);
  },
};
