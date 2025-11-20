import axios, { AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';

// const API_URL = 'http://localhost:5000/api';
const API_URL = 'https://saanj-backend-code.onrender.com/api';

export async function fetcher(endpoint: string, options: AxiosRequestConfig = {}) {
  // Get the token from localStorage
  const token = localStorage.getItem('authToken');

  const config = {
    url: `${API_URL}${endpoint}`,
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    } as RawAxiosRequestHeaders,
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error('API Fetcher Error:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'An unexpected error occurred.');
  }
}