import { getPrismaClient, isDatabaseConnected } from '../config/database.js';
import { localStore } from '../utils/localStore.js';
import { DEFAULT_LEADERSHIP_TREE } from '../utils/defaultLeadership.js';

export { DEFAULT_LEADERSHIP_TREE };

// Helper to assemble flat array of items into nested hierarchy tree
export const buildHierarchyTree = (items = []) => {
  const itemMap = {};
  const rootNodes = [];

  // Clone items and initialize children array
  items.forEach((item) => {
    itemMap[item.id] = { ...item, children: [] };
  });

  // Link children to parents
  items.forEach((item) => {
    if (item.parentId && itemMap[item.parentId]) {
      itemMap[item.parentId].children.push(itemMap[item.id]);
    } else {
      rootNodes.push(itemMap[item.id]);
    }
  });

  // Sort children at each level by order
  const sortTreeNodes = (nodes) => {
    nodes.sort((a, b) => (a.order || 0) - (b.order || 0));
    nodes.forEach((node) => {
      if (node.children && node.children.length > 0) {
        sortTreeNodes(node.children);
      }
    });
  };

  sortTreeNodes(rootNodes);
  return rootNodes;
};

// Check if assigning newParentId to memberId would cause a circular relationship (Prisma)
export const wouldCreateCycle = async (prisma, memberId, newParentId) => {
  if (!newParentId) return false;
  if (memberId === newParentId) return true;

  let currentCheckId = newParentId;
  const visited = new Set();

  while (currentCheckId) {
    if (currentCheckId === memberId) {
      return true; // Cycle detected: memberId is an ancestor of newParentId!
    }
    if (visited.has(currentCheckId)) {
      return true; // Already visited node in chain
    }
    visited.add(currentCheckId);

    const parentNode = await prisma.leadershipMember.findUnique({
      where: { id: currentCheckId },
      select: { parentId: true },
    });

    currentCheckId = parentNode ? parentNode.parentId : null;
  }

  return false;
};

// Check if assigning newParentId to memberId would cause a circular relationship (LocalStore)
export const wouldCreateCycleLocal = (members, memberId, newParentId) => {
  if (!newParentId) return false;
  if (memberId === newParentId) return true;

  let currentCheckId = newParentId;
  const visited = new Set();

  while (currentCheckId) {
    if (currentCheckId === memberId) return true;
    if (visited.has(currentCheckId)) return true;
    visited.add(currentCheckId);

    const parentNode = members.find((m) => m.id === currentCheckId);
    currentCheckId = parentNode ? parentNode.parentId : null;
  }
  return false;
};

export const leadershipService = {
  // Get all members for public display (published only)
  getPublishedTree: async () => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const members = await prisma.leadershipMember.findMany({
          where: { isPublished: true },
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
        });

        if (members && members.length > 0) {
          return {
            flat: members,
            tree: buildHierarchyTree(members),
            isFallback: false,
          };
        }
      } catch (err) {
        // Fall through to localStore
      }
    }

    const all = localStore.getCollection('leadership') || [];
    const published = all.filter((m) => m.isPublished !== false);
    return {
      flat: published,
      tree: buildHierarchyTree(published),
      isFallback: false,
    };
  },

  // Get all members for Admin (including unpublished)
  getAllForAdmin: async () => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const members = await prisma.leadershipMember.findMany({
          orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
          include: {
            parent: {
              select: { id: true, name: true, designation: true },
            },
            _count: {
              select: { children: true },
            },
          },
        });

        if (members && members.length > 0) {
          return {
            flat: members,
            tree: buildHierarchyTree(members),
            isFallback: false,
          };
        }
      } catch (err) {
        // Fall through to localStore
      }
    }

    const members = localStore.getCollection('leadership') || [];
    const enriched = members.map((m) => {
      const parent = members.find((p) => p.id === m.parentId);
      const childCount = members.filter((c) => c.parentId === m.id).length;
      return {
        ...m,
        parent: parent ? { id: parent.id, name: parent.name, designation: parent.designation } : null,
        _count: { children: childCount },
      };
    });

    return {
      flat: enriched,
      tree: buildHierarchyTree(enriched),
      isFallback: false,
    };
  },

  getMemberById: async (id) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const member = await prisma.leadershipMember.findUnique({
          where: { id },
          include: {
            parent: true,
            children: {
              orderBy: { order: 'asc' },
            },
          },
        });
        if (member) return member;
      } catch {}
    }

    const members = localStore.getCollection('leadership') || [];
    const member = members.find((m) => m.id === id);
    if (!member) return null;

    const parent = members.find((p) => p.id === member.parentId) || null;
    const children = members
      .filter((c) => c.parentId === id)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    return { ...member, parent, children };
  },

  createMember: async (data) => {
    const parentId = data.parentId && data.parentId !== 'none' ? data.parentId : null;

    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        if (parentId) {
          const parentExists = await prisma.leadershipMember.findUnique({
            where: { id: parentId },
          });
          if (!parentExists) {
            const error = new Error('Selected parent member does not exist');
            error.statusCode = 400;
            throw error;
          }
        }

        return await prisma.leadershipMember.create({
          data: {
            name: data.name.trim(),
            designation: data.designation.trim(),
            photo: data.photo || null,
            bio: data.bio || null,
            email: data.email || null,
            phone: data.phone || null,
            order: data.order !== undefined ? parseInt(data.order, 10) : 0,
            isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
            parentId,
          },
        });
      } catch (prismaErr) {
        if (prismaErr.statusCode === 400) throw prismaErr;
        // Fall back to localStore below
      }
    }

    const members = localStore.getCollection('leadership') || [];
    if (parentId && !members.some((m) => m.id === parentId)) {
      const error = new Error('Selected parent member does not exist');
      error.statusCode = 400;
      throw error;
    }

    const newMember = {
      id: `leader-${Date.now()}`,
      name: data.name.trim(),
      designation: data.designation.trim(),
      photo: data.photo || null,
      bio: data.bio || null,
      email: data.email || null,
      phone: data.phone || null,
      order: data.order !== undefined ? parseInt(data.order, 10) : members.length,
      isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
      parentId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return localStore.addItem('leadership', newMember);
  },

  updateMember: async (id, data) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const existing = await prisma.leadershipMember.findUnique({ where: { id } });
        if (!existing) {
          const error = new Error('Leadership member not found');
          error.statusCode = 404;
          throw error;
        }

        let parentId = existing.parentId;
        if (data.parentId !== undefined) {
          parentId = data.parentId && data.parentId !== 'none' ? data.parentId : null;
        }

        // Verify circular relationship
        if (parentId && parentId !== existing.parentId) {
          const isCycle = await wouldCreateCycle(prisma, id, parentId);
          if (isCycle) {
            const error = new Error('Circular relationship detected: Cannot assign a member as their own descendant.');
            error.statusCode = 400;
            throw error;
          }
        }

        return await prisma.leadershipMember.update({
          where: { id },
          data: {
            name: data.name !== undefined ? data.name.trim() : existing.name,
            designation: data.designation !== undefined ? data.designation.trim() : existing.designation,
            photo: data.photo !== undefined ? data.photo : existing.photo,
            bio: data.bio !== undefined ? data.bio : existing.bio,
            email: data.email !== undefined ? data.email : existing.email,
            phone: data.phone !== undefined ? data.phone : existing.phone,
            order: data.order !== undefined ? parseInt(data.order, 10) : existing.order,
            isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : existing.isPublished,
            parentId,
          },
        });
      } catch (prismaErr) {
        if (prismaErr.statusCode === 400 || prismaErr.statusCode === 404) throw prismaErr;
        // Fall back to localStore below
      }
    }

    const members = localStore.getCollection('leadership') || [];
    const existing = members.find((m) => m.id === id);
    if (!existing) {
      const error = new Error('Leadership member not found');
      error.statusCode = 404;
      throw error;
    }

    let parentId = existing.parentId;
    if (data.parentId !== undefined) {
      parentId = data.parentId && data.parentId !== 'none' ? data.parentId : null;
    }

    if (parentId && parentId !== existing.parentId) {
      const isCycle = wouldCreateCycleLocal(members, id, parentId);
      if (isCycle) {
        const error = new Error('Circular relationship detected: Cannot assign a member as their own descendant.');
        error.statusCode = 400;
        throw error;
      }
    }

    const updates = {
      ...(data.name !== undefined ? { name: data.name.trim() } : {}),
      ...(data.designation !== undefined ? { designation: data.designation.trim() } : {}),
      ...(data.photo !== undefined ? { photo: data.photo } : {}),
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
      ...(data.email !== undefined ? { email: data.email } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.order !== undefined ? { order: parseInt(data.order, 10) } : {}),
      ...(data.isPublished !== undefined ? { isPublished: Boolean(data.isPublished) } : {}),
      parentId,
    };

    return localStore.updateItem('leadership', id, updates);
  },

  deleteMember: async (id, force = false) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const existing = await prisma.leadershipMember.findUnique({
          where: { id },
          include: { children: true },
        });

        if (!existing) {
          const error = new Error('Leadership member not found');
          error.statusCode = 404;
          throw error;
        }

        if (existing.children && existing.children.length > 0 && !force) {
          const error = new Error(
            `Member has ${existing.children.length} direct child member(s). Please confirm reassigning children or force deletion.`
          );
          error.statusCode = 409;
          error.childCount = existing.children.length;
          throw error;
        }

        if (existing.children && existing.children.length > 0) {
          await prisma.leadershipMember.updateMany({
            where: { parentId: id },
            data: { parentId: existing.parentId || null },
          });
        }

        return await prisma.leadershipMember.delete({
          where: { id },
        });
      } catch (prismaErr) {
        if (prismaErr.statusCode === 404 || prismaErr.statusCode === 409) throw prismaErr;
        // Fall back to localStore below
      }
    }

    const members = localStore.getCollection('leadership') || [];
    const existing = members.find((m) => m.id === id);
    if (!existing) {
      const error = new Error('Leadership member not found');
      error.statusCode = 404;
      throw error;
    }

    const children = members.filter((m) => m.parentId === id);
    if (children.length > 0 && !force) {
      const error = new Error(
        `Member has ${children.length} direct child member(s). Please confirm reassigning children or force deletion.`
      );
      error.statusCode = 409;
      error.childCount = children.length;
      throw error;
    }

    // Reassign children to existing.parentId (or null)
    if (children.length > 0) {
      children.forEach((c) => {
        localStore.updateItem('leadership', c.id, { parentId: existing.parentId || null });
      });
    }

    localStore.deleteItem('leadership', id);
    return true;
  },

  reorderMembers: async (items) => {
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const updates = items.map((item, index) =>
          prisma.leadershipMember.update({
            where: { id: item.id },
            data: {
              order: item.order !== undefined ? item.order : index,
              parentId: item.parentId !== undefined ? item.parentId : undefined,
            },
          })
        );
        return await prisma.$transaction(updates);
      } catch (prismaErr) {
        // Fall back to localStore below
      }
    }

    items.forEach((item, index) => {
      const updates = {
        order: item.order !== undefined ? item.order : index,
      };
      if (item.parentId !== undefined) {
        updates.parentId = item.parentId;
      }
      localStore.updateItem('leadership', item.id, updates);
    });

    return localStore.getCollection('leadership');
  },
};
