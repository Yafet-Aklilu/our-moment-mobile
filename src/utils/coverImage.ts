import { env } from '@/config/env';

/**
 * Resolve template cover paths for React Native.
 *
 * Mirrors web `resources/js/utils/coverImage.js`, but absolute-izes relative
 * paths against the Laravel public origin (API host without `/api/v1`).
 *
 * Root cause of broken mobile images: API returns paths like
 * `/images/templates/{slug}.jpg` which work same-origin on web, but RN Image
 * requires a full `http(s)://…` URL.
 */
export function coverImageUrl(
  coverImage: string | null | undefined,
  assetOrigin: string = env.assetOrigin,
): string | null {
  if (!coverImage) return null;

  const trimmed = coverImage.trim();
  if (!trimmed) return null;

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  const origin = assetOrigin.replace(/\/$/, '');

  if (trimmed.startsWith('/')) {
    return `${origin}${trimmed}`;
  }

  if (trimmed.startsWith('images/')) {
    return `${origin}/${trimmed}`;
  }

  return `${origin}/storage/${trimmed}`;
}

/**
 * Prefer a sized remote URL when the host supports query resizing.
 * Local Laravel public JPGs are already modest (~100–200KB); return as-is.
 */
export function coverImageUrlForGrid(coverImage: string | null | undefined): string | null {
  return coverImageUrl(coverImage);
}
