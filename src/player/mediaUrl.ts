/**
 * Resolve a MomentConfig media URL to something React Native `<Image>` /
 * `expo-image` can load.
 *
 * `MomentConfigBuilder::absoluteUrl()` already returns absolute URLs for
 * moment media (`url()` helper), so in practice every URL arriving here is
 * already `http(s)://...`. This is a defensive fallback for any relative
 * `/api/v1/media/...` (or `/storage/...`) path that slips through, prefixed
 * with the asset origin (API host without the `/api/v1` suffix) per
 * `src/config/env.ts`.
 */
import { env } from '@/config/env';

export function resolveMediaUrl(url: string | null | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (/^(https?:)?\/\//i.test(trimmed) || /^data:/i.test(trimmed)) {
    return trimmed;
  }
  const origin = env.assetOrigin.replace(/\/$/, '');
  const path = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  return `${origin}${path}`;
}
