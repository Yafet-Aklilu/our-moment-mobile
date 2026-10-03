import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { env } from '@/config/env';
import type { ApiErrorEnvelope, ValidationErrorEnvelope } from '@/types/api';

import { clearAuthToken, getAuthToken } from './tokenStorage';

export class ApiClientError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly details?: Record<string, unknown>;
  readonly validationErrors?: Record<string, string[]>;

  constructor(params: {
    message: string;
    status: number;
    code?: string;
    details?: Record<string, unknown>;
    validationErrors?: Record<string, string[]>;
  }) {
    super(params.message);
    this.name = 'ApiClientError';
    this.status = params.status;
    this.code = params.code;
    this.details = params.details;
    this.validationErrors = params.validationErrors;
  }
}

type UnauthorizedListener = () => void;
let onUnauthorized: UnauthorizedListener | null = null;

export function setUnauthorizedHandler(handler: UnauthorizedListener | null) {
  onUnauthorized = handler;
}

// eslint-disable-next-line import/no-named-as-default-member -- axios public API
export const apiClient = axios.create({
  baseURL: env.apiUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  timeout: 30_000,
});

apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorEnvelope & ValidationErrorEnvelope>) => {
    const status = error.response?.status ?? 0;
    const payload = error.response?.data;

    if (status === 401) {
      await clearAuthToken();
      onUnauthorized?.();
    }

    if (payload && typeof payload === 'object') {
      if ('errors' in payload && payload.errors) {
        throw new ApiClientError({
          message: payload.message || 'Validation failed.',
          status,
          validationErrors: payload.errors,
        });
      }

      if ('message' in payload) {
        throw new ApiClientError({
          message: payload.message || error.message,
          status,
          code: 'code' in payload ? payload.code : undefined,
          details: 'details' in payload ? payload.details : undefined,
        });
      }
    }

    throw new ApiClientError({
      message: networkErrorMessage(error),
      status,
      code: status === 0 ? 'network_error' : undefined,
    });
  },
);

function networkErrorMessage(error: AxiosError): string {
  const code = error.code;
  if (
    code === 'ERR_NETWORK' ||
    code === 'ECONNABORTED' ||
    code === 'ETIMEDOUT' ||
    !error.response
  ) {
    return (
      'Can’t reach the OurMoment API. Make sure Laravel is running and ' +
      'EXPO_PUBLIC_API_URL matches this computer’s current Wi‑Fi IP, then restart Expo.'
    );
  }
  return error.message || 'Network request failed.';
}

export function unwrapData<T>(payload: { data: T }): T {
  return payload.data;
}
