const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
const SERVER_URL = API_BASE_URL.replace(/\/api\/v1\/?$/, '');

/**
 * Resolves any image URL (relative upload path, data URI, or absolute URL)
 * to a working, fully-qualified source.
 */
export const getFullImageUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('data:')) {
    return trimmed;
  }
  if (trimmed.startsWith('/uploads')) {
    return `${SERVER_URL}${trimmed}`;
  }
  if (trimmed.startsWith('uploads/')) {
    return `${SERVER_URL}/${trimmed}`;
  }
  return trimmed;
};
