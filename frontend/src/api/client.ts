import axios, { type AxiosError } from 'axios';
import { clearAuthSession } from './auth';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '/api';

const AUTH_TOKEN_KEY = 'lifeos.auth_token';

export const api = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAuthSession();
      window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export function unwrapData<T>(payload: unknown): T {
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export function getApiErrorMessage(error: unknown, fallback = 'Đã xảy ra lỗi') {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (data && typeof data === 'object') {
      const record = data as Record<string, unknown>;
      const message = record.message ?? record.error ?? record.detail;
      if (typeof message === 'string' && message.trim()) return message;
    }
    return error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
