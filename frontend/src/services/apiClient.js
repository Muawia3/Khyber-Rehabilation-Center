const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

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
