// Dynamically determine the API Base URL:
// 1. Explicit external VITE_API_BASE_URL (if valid public URL, not localhost)
// 2. In production / deployed domain (e.g. Vercel), ignores local .env localhost and uses '/api/v1'
// 3. When accessed from mobile over local Wi-Fi, targets http://<laptop-ip>:5000/api/v1
// 4. In local development on laptop, connects to http://localhost:5000/api/v1
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  if (typeof window !== 'undefined') {
    const isCurrentHostLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    // If an external production API URL is provided (e.g. https://api.khyberrehab.org/api/v1)
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl.replace(/\/+$/, '');
    }

    // On deployed production domains (like Vercel) or when accessed on mobile
    if (import.meta.env.PROD || !isCurrentHostLocal) {
      if (!import.meta.env.PROD && window.location.hostname) {
        return `http://${window.location.hostname}:5000/api/v1`;
      }
      return '/api/v1';
    }
  }

  return envUrl ? envUrl.replace(/\/+$/, '') : 'http://localhost:5000/api/v1';
};

const BASE_URL = getBaseUrl();

export const apiClient = async (endpoint, { body, ...customConfig } = {}, retries = 1) => {
  const headers = { 'Content-Type': 'application/json' };

  const token = localStorage.getItem('khyber_token');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    let data;
    try {
      data = await response.json();
    } catch {
      data = null;
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.errors?.join(', ') || `Request failed with status ${response.status}`;
      const error = new Error(errorMessage);
      error.statusCode = response.status;
      error.details = data?.errors || null;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    // Transient glitch auto-retry
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, 300));
      return apiClient(endpoint, { body, ...customConfig }, retries - 1);
    }
    // Network / server offline error
    const netError = new Error(
      'Unable to connect to the rehabilitation center API. Please check your internet connection or verify the server status.'
    );
    netError.isNetworkError = true;
    throw netError;
  }
};
