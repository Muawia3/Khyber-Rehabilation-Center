import { getPrismaClient, isDatabaseConnected } from '../config/database.js';
import { DEFAULT_SITE_CONTENT } from '../utils/defaultSiteContent.js';
import { localStore } from '../utils/localStore.js';

// In-memory cache fallback to ensure updates persist even when PostgreSQL is disconnected
const inMemoryCache = new Map();

// Helper to safely parse JSON strings or return string as is
const parseContentValue = (content) => {
  if (typeof content !== 'string') return content;
  try {
    return JSON.parse(content);
  } catch {
    return content;
  }
};

export const contentService = {
  getSiteContents: async ({ section, key } = {}) => {
    const contentMap = {};

    // 1. Populate with base defaults
    Object.keys(DEFAULT_SITE_CONTENT).forEach((defaultKey) => {
      contentMap[defaultKey] = DEFAULT_SITE_CONTENT[defaultKey];
    });

    // 2. Overlay persisted items from localStore (JSON file)
    try {
      const persistedItems = localStore.getCollection('site_contents') || [];
      persistedItems.forEach((item) => {
        if (item.key && item.content) {
          contentMap[item.key] = parseContentValue(item.content);
        }
      });
    } catch {}

    // 3. Overlay any active in-memory cached updates
    inMemoryCache.forEach((value, k) => {
      contentMap[k] = parseContentValue(value.content);
    });

    // 3. Query PostgreSQL if database is connected
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        const where = {};
        if (section) where.section = section;
        if (key) where.key = key;

        const items = await prisma.siteContent.findMany({ where });
        items.forEach((item) => {
          contentMap[item.key] = parseContentValue(item.content);
        });
      } catch (err) {
        // Fallback to localStore and cache
      }
    }

    if (key) {
      return { [key]: contentMap[key] || DEFAULT_SITE_CONTENT[key] || null };
    }

    return contentMap;
  },

  getAllRawContents: async ({ section } = {}) => {
    try {
      const prisma = getPrismaClient();
      const where = {};
      if (section && section !== 'All') where.section = section;
      return await prisma.siteContent.findMany({
        where,
        orderBy: [{ section: 'asc' }, { key: 'asc' }],
      });
    } catch {
      // Return cached list
      const results = [];
      Object.keys(DEFAULT_SITE_CONTENT).forEach((k) => {
        const cached = inMemoryCache.get(k);
        results.push({
          id: `default-${k}`,
          key: k,
          section: 'global',
          title: k.replace(/_/g, ' ').toUpperCase(),
          content: cached ? cached.content : JSON.stringify(DEFAULT_SITE_CONTENT[k]),
          updatedAt: new Date(),
        });
      });
      return results;
    }
  },

  upsertContent: async ({ key, section, title, content }) => {
    const stringContent = typeof content === 'object' ? JSON.stringify(content) : String(content || '');

    // Always update in-memory cache and localStore first for instant reactivity & persistence
    inMemoryCache.set(key, {
      key,
      section: section || 'general',
      title: title || null,
      content: stringContent,
    });

    try {
      const existingItems = localStore.getCollection('site_contents') || [];
      const itemIdx = existingItems.findIndex((it) => it.key === key);
      const record = {
        key,
        section: section || 'general',
        title: title || null,
        content: stringContent,
        updatedAt: new Date().toISOString(),
      };
      if (itemIdx >= 0) {
        existingItems[itemIdx] = record;
      } else {
        existingItems.push(record);
      }
      localStore.saveCollection('site_contents', existingItems);
    } catch (storeErr) {
      console.warn('[ContentService] localStore save warning:', storeErr.message);
    }

    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        return await prisma.siteContent.upsert({
          where: { key },
          update: {
            section: section || 'general',
            title: title || null,
            content: stringContent,
          },
          create: {
            key,
            section: section || 'general',
            title: title || null,
            content: stringContent,
          },
        });
      } catch (prismaErr) {
        console.warn('[ContentService] Prisma upsert error:', prismaErr.message);
      }
    }

    return {
      id: `cached-${key}`,
      key,
      section: section || 'general',
      title: title || null,
      content: stringContent,
      updatedAt: new Date(),
    };
  },

  deleteContent: async (key) => {
    inMemoryCache.delete(key);
    if (isDatabaseConnected()) {
      try {
        const prisma = getPrismaClient();
        await prisma.siteContent.delete({
          where: { key },
        });
      } catch {}
    }
    return { key, deleted: true };
  },
};
