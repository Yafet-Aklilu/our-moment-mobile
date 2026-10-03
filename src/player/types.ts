/**
 * Moment Player boundary.
 *
 * Contract for navigation / QR / deep links / share:
 *   route: /player/[publicToken]  (and /m/[publicToken] alias)
 *   data:  GET /api/v1/public/{publicToken}
 *
 * Implementation strategy:
 * 1. Native player (future) — mirrors web scene concepts
 * 2. WebViewFallback — temporary parity using canonical /m/{token} web URL
 *
 * Swapping implementations must NOT change QR URLs, deep links, or share format.
 *
 * Note — owner Preview already uses the native player: `NativeMomentPlayer`
 * (this folder) renders `GET /api/v1/moments/{id}/preview` configs directly
 * for `app/(app)/moments/[id]/preview.tsx`. It is a separate, simpler
 * surface than this public-token boundary (no activation/publish calls,
 * always the full owner config) and does not participate in
 * `resolvePlayerMode` — that flag only governs the public/recipient player
 * behind `MomentPlayerBoundary` above.
 */
import { buildMomentWebUrl } from '@/linking/momentUrl';

export type MomentPlayerMode = 'native' | 'webview-fallback';

export type MomentPlayerProps = {
  publicToken: string;
  /** Force mode; default prefers native when available. */
  mode?: MomentPlayerMode;
};

/**
 * Feature flag — set true when native scene player ships.
 * Until then, boundary still loads public config + WebView fallback.
 */
export const NATIVE_PLAYER_READY = false;

export function resolvePlayerMode(override?: MomentPlayerMode): MomentPlayerMode {
  if (override) return override;
  return NATIVE_PLAYER_READY ? 'native' : 'webview-fallback';
}

export function webPlayerUrl(publicToken: string): string {
  return buildMomentWebUrl(publicToken);
}
