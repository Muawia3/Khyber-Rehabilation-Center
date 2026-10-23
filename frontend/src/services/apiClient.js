// Dynamically determine the API Base URL:
// 1. Explicit external VITE_API_BASE_URL (if valid public URL, not localhost)
// 2. On local computer (localhost / 127.0.0.1 in both dev and preview), connects to http://localhost:5000/api/v1
// 3. When accessed from mobile over local Wi-Fi, targets http://<laptop-ip>:5000/api/v1
// 4. On deployed production domains (e.g. Vercel), uses '/api/v1'
const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname || '';
    const isCurrentHostLocal = hostname === 'localhost' || hostname === '127.0.0.1';
    const isLocalNetworkIp = /^192\.168\.|^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(hostname);

    // 1. If an external production API URL is provided (e.g. https://api.khyberrehab.org/api/v1)
    if (envUrl && !envUrl.includes('localhost') && !envUrl.includes('127.0.0.1')) {
      return envUrl.replace(/\/+$/, '');
    }

    // 2. On local development or preview on laptop/PC, always connect directly to backend
    if (isCurrentHostLocal) {
      return 'http://localhost:5000/api/v1';
    }

    // 3. When accessed from mobile over local Wi-Fi/LAN, connect to laptop's IP backend
    if (isLocalNetworkIp) {
      return `http://${hostname}:5000/api/v1`;
    }

    // 4. On deployed production domains (like Vercel)
    return '/api/v1';
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

    const contentType = response.headers.get('content-type') || '';
    const isHtmlResponse = contentType.includes('text/html');

    if (isHtmlResponse) {
      const error = new Error('The API endpoint returned an HTML web page instead of JSON data. Ensure the backend Express server is running on port 5000.');
      error.statusCode = 502;
      error.isHtmlResponse = true;
      throw error;
    }

    if (!response.ok) {
      let errorMessage = data?.message || data?.errors?.join(', ');
      if (!errorMessage) {
        if (response.status === 405) {
          errorMessage = 'The requested operation is not supported by the hosting server (HTTP 405 Method Not Allowed).';
        } else if (response.status === 404) {
          errorMessage = 'The API endpoint was not found on this server (HTTP 404).';
        } else {
          errorMessage = `Request failed with status ${response.status}`;
        }
      }
      const error = new Error(errorMessage);
      error.statusCode = response.status;
      error.details = data?.errors || null;
      throw error;
    }

    // If body was empty or not an object, return safe non-null structure
    if (data === null || typeof data !== 'object') {
      return { success: true, statusCode: response.status, data: data ?? null };
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
