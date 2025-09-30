import { Env } from '@/lib/env';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  auth?: boolean;
  signal?: AbortSignal;
};

const TOKEN_KEY = 'auth_token';

export async function setAuthToken(token: string | null) {
  if (!token) return AsyncStorage.removeItem(TOKEN_KEY);
  return AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function getAuthToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

function buildUrl(path: string, query?: RequestOptions['query']) {
  const url = new URL(path, Env.API_URL.endsWith('/') ? Env.API_URL : Env.API_URL + '/');
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.append(k, String(v));
    });
  }
  return url.toString();
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', headers = {}, query, body, auth = true, signal } = options;

  const finalHeaders: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...headers,
  };

  if (auth) {
    const token = await getAuthToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path, query), {
    method,
    headers: finalHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  const text = await res.text();
  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson && text ? JSON.parse(text) : (text as unknown as T);

  if (!res.ok) {
    const error: any = new Error((data as any)?.message || 'Request failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data as T;
}

export const Api = {
  get: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: Omit<RequestOptions, 'method' | 'body'>) =>
    apiFetch<T>(path, { ...options, method: 'DELETE' }),
};


