import { env } from '@/config/env';

/**
 * Canonical Moment URLs — same format as web share links.
 * Never invent a second QR / deep-link scheme for Moments.
 *
 * Examples:
 *   https://ourmoment.app/m/{public_token}
 *   ourmoment://m/{public_token}  (custom scheme fallback)
 */

const TOKEN_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;

export function buildMomentWebUrl(publicToken: string): string {
  return `${env.webOrigin}${env.momentPathPrefix}/${publicToken}`;
}

export function isValidPublicToken(token: string): boolean {
  return TOKEN_PATTERN.test(token);
}

/**
 * Extract a public_token from camera / Universal Link / custom scheme URLs.
 */
export function parseMomentPublicToken(raw: string): string | null {
  const input = raw.trim();
  if (!input) return null;

  // Bare token pasted by power users
  if (isValidPublicToken(input) && !input.includes('/') && !input.includes(':')) {
    return input;
  }

  try {
    const withProtocol = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(input)
      ? input
      : `https://${input}`;
    const url = new URL(withProtocol);
    const parts = url.pathname.split('/').filter(Boolean);
    const mIndex = parts.findIndex((p) => p === 'm');
    if (mIndex >= 0 && parts[mIndex + 1]) {
      const token = parts[mIndex + 1];
      return isValidPublicToken(token) ? token : null;
    }
  } catch {
    return null;
  }

  return null;
}

export function isOurMomentUrl(raw: string): boolean {
  return parseMomentPublicToken(raw) != null;
}
