// Dynamically determine the API Base URL:
// 1. Explicit VITE_API_BASE_URL env var if provided
// 2. In production (e.g. Vercel deployment), relative path '/api/v1' to prevent mixed-content/localhost errors on mobile
// 3. In development, connects to localhost:5000 or host IP if accessed from a mobile phone on the same Wi-Fi
const getBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, '');
  }
  if (typeof window !== 'undefined') {
    if (import.meta.env.PROD) {
      return '/api/v1';
    }
    const hostname = window.location.hostname;
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `http://${hostname}:5000/api/v1`;
    }
  }
  return 'http://localhost:5000/api/v1';
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
