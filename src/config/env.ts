import Constants from 'expo-constants';

type Extra = {
  apiUrl?: string;
  webOrigin?: string;
  assetOrigin?: string;
  momentPathPrefix?: string;
};

const extra = (Constants.expoConfig?.extra ?? {}) as Extra;

function stripApiV1(apiUrl: string): string {
  return apiUrl.replace(/\/?api\/v1\/?$/i, '').replace(/\/$/, '');
}

const apiUrl = (
  process.env.EXPO_PUBLIC_API_URL ??
  extra.apiUrl ??
  'http://127.0.0.1:8000/api/v1'
).replace(/\/$/, '');

/**
 * API + web origins. Override via app.config extra / EXPO_PUBLIC_*.
 * Default targets local Laravel (`our-moment-web`).
 */
export const env = {
  apiUrl,

  /** Canonical web origin for Universal Links and share URLs. */
  webOrigin: (
    process.env.EXPO_PUBLIC_WEB_ORIGIN ??
    extra.webOrigin ??
    'https://ourmoment.app'
  ).replace(/\/$/, ''),

  /**
   * Origin that serves Laravel `public/` assets (template covers, etc.).
   * Defaults to the API host without `/api/v1` — NOT production webOrigin,
   * so local device builds load covers from the same machine as the API.
   */
  assetOrigin: (
    process.env.EXPO_PUBLIC_ASSET_ORIGIN ??
    extra.assetOrigin ??
    stripApiV1(apiUrl)
  ).replace(/\/$/, ''),

  momentPathPrefix: extra.momentPathPrefix ?? '/m',
} as const;
