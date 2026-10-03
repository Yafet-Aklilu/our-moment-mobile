import { apiClient, unwrapData } from '@/api/client';
import type {
  ApiSuccessEnvelope,
  AuthTokenPayload,
  User,
} from '@/types/api';

export type LoginInput = {
  email: string;
  password: string;
  device_name?: string;
};

export type RegisterInput = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  /** Required by API (`accepted`) — mirrors web register. */
  terms: true | 1 | '1' | 'on' | 'yes' | 'true';
  device_name?: string;
};

export const authApi = {
  async login(input: LoginInput): Promise<AuthTokenPayload> {
    const { data } = await apiClient.post<ApiSuccessEnvelope<AuthTokenPayload>>(
      '/auth/login',
      input,
    );
    return unwrapData(data);
  },

  async register(input: RegisterInput): Promise<AuthTokenPayload> {
    const { data } = await apiClient.post<ApiSuccessEnvelope<AuthTokenPayload>>(
      '/auth/register',
      input,
    );
    return unwrapData(data);
  },

  async logout(): Promise<{ revoked: true }> {
    const { data } = await apiClient.post<ApiSuccessEnvelope<{ revoked: true }>>(
      '/auth/logout',
    );
    return unwrapData(data);
  },

  async forgotPassword(email: string): Promise<{ status: string }> {
    const { data } = await apiClient.post<ApiSuccessEnvelope<{ status: string }>>(
      '/auth/password/forgot',
      { email },
    );
    return unwrapData(data);
  },

  async resetPassword(input: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ status: string }> {
    const { data } = await apiClient.post<ApiSuccessEnvelope<{ status: string }>>(
      '/auth/password/reset',
      input,
    );
    return unwrapData(data);
  },
};

export const meApi = {
  async get(): Promise<User> {
    const { data } = await apiClient.get<ApiSuccessEnvelope<User>>('/me');
    return unwrapData(data);
  },
};
