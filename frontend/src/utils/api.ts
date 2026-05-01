const DEFAULT_PRODUCTION_API_URL = 'https://icbp-git.onrender.com';

const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();

export const API_BASE_URL = (
  configuredApiUrl || (import.meta.env.PROD ? DEFAULT_PRODUCTION_API_URL : '')
).replace(/\/$/, '');

export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export function backendUrl(path: string): string {
  return apiUrl(path);
}