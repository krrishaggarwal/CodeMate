const API_URL = "http://localhost:5000"; // Backend URL

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  try {
    const headers = {
      'Content-Type': 'application/json',
    };

    const config = {
      method,
      headers,
    };

    if (body && method !== 'GET') {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error(`[apiRequest] ${method} ${endpoint} failed:`, error.message);
    throw error;
  }
};
