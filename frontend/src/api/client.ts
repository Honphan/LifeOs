import axios, { type AxiosError } from 'axios';
import { clearAuthSession } from './auth';
import { readApiMessage, unwrapApiResponse } from './response';

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
  return unwrapApiResponse<T>(payload);
}

export function unwrapArrayData<T>(payload: unknown): T[] {
  const data = unwrapApiResponse<unknown>(payload);
  return Array.isArray(data) ? data : [];
}

export function getApiErrorMessage(error: unknown, fallback = 'Đã xảy ra lỗi') {
  if (axios.isAxiosError(error)) {
    const message = readApiMessage(error.response?.data);
    if (message) return message;
    return error.message || fallback;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}

export function isEmptyApiError(error: unknown) {
  if (!axios.isAxiosError(error)) return false;

  const status = error.response?.status;
  if (status === 404 || status === 204) return true;

  const message = readApiMessage(error.response?.data) ?? error.message ?? '';
  return /không có|chưa có|no data|empty|not found|not exist|null/i.test(message);
}
