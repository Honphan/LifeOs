import axios, { type AxiosError } from 'axios';
import { readApiMessage, readApiToken, unwrapApiResponse } from './response';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';
const loginPath = import.meta.env.VITE_AUTH_LOGIN_PATH ?? '/auth/login';
const registerPath = import.meta.env.VITE_AUTH_REGISTER_PATH ?? '/auth/register';
const backendOrigin =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') ??
  new URL(import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080/api').origin;
const logoutPath = import.meta.env.VITE_AUTH_LOGOUT_PATH ?? '';

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
}

const http = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

const AUTH_TOKEN_KEY = 'lifeos.auth_token';
const AUTH_USER_KEY = 'lifeos.auth_user';

interface AuthResponse {
  accessToken: string;
}

function buildApiUrl(path: string) {
  if (!apiBaseUrl) return path;

  const normalizedBaseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl : `${apiBaseUrl}/`;
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

  return new URL(normalizedPath, normalizedBaseUrl).toString();
}

export function hasAuthToken(value: unknown) {
  return Boolean(readApiToken(value));
}

function persistAuthSession(value: unknown) {
  const token = readApiToken(value);
  if (token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  if (value && typeof value === 'object') {
    const record = value as Record<string, unknown>;
    const user = record.user ?? record.profile ?? record.data;
    if (user && typeof user === 'object') {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    }
  }
}

function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<unknown>;
    return readApiMessage(axiosError.response?.data) ?? axiosError.message;
  }

  if (error instanceof Error) return error.message;
  return 'An unexpected error occurred';
}

export async function login(payload: LoginPayload) {
  const response = await http.post(buildApiUrl(loginPath), payload);
  const data = unwrapApiResponse<AuthResponse>(response.data);
  persistAuthSession(data);
  return data;
}

export async function register(payload: RegisterPayload) {
  const response = await http.post(buildApiUrl(registerPath), payload);
  const data = unwrapApiResponse<AuthResponse>(response.data);
  persistAuthSession(data);
  return data;
}

export function startGoogleLogin() {
  window.location.assign(`${backendOrigin}/oauth2/authorization/google`);
}

export interface StoredAuthUser {
  email?: string;
  name?: string;
  picture?: string;
}

export function getStoredAuthUser(): StoredAuthUser | null {
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuthUser;
  } catch {
    return null;
  }
}

/** Lưu token/user sau redirect OAuth (query ?token=...&email=...). */
export function completeOAuthFromSearchParams(searchParams: URLSearchParams): boolean {
  const token = searchParams.get('token');
  if (!token?.trim()) return false;

  localStorage.setItem(AUTH_TOKEN_KEY, token);

  const email = searchParams.get('email') ?? undefined;
  const name = searchParams.get('name') ?? undefined;
  const picture = searchParams.get('picture') ?? undefined;

  if (email || name || picture) {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify({ email, name, picture }));
  }

  return true;
}

export function extractAuthErrorMessage(error: unknown) {
  return getErrorMessage(error);
}

export function clearAuthSession() {
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  } catch (e) {
    // ignore
  }
}

export async function logout() {
  // Try to call backend logout if provided, but never block clearing session
  if (logoutPath) {
    try {
      await http.post(buildApiUrl(logoutPath));
    } catch (e) {
      // ignore network errors during logout
    }
  }

  clearAuthSession();
  // Redirect to login page
  window.location.assign('/login');
}