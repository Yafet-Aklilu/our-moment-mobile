import { getAuthToken } from '@/api/tokenStorage';
import { env } from '@/config/env';

/**
 * Resolve media URLs for Image display.
 * API returns `/api/v1/media/{id}` which needs absolute origin + Bearer header.
 */
export function absoluteMediaUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith('/')) {
    return `${env.assetOrigin}${trimmed}`;
  }
  return `${env.apiUrl.replace(/\/$/, '')}/${trimmed}`;
}

export async function mediaAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
