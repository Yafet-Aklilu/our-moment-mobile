import { apiClient, unwrapData } from '@/api/client';
import type {
  ApiSuccessEnvelope,
  PublicMomentPayload,
  Reaction,
} from '@/types/api';

export const publicApi = {
  async get(publicToken: string): Promise<PublicMomentPayload> {
    const { data } = await apiClient.get<ApiSuccessEnvelope<PublicMomentPayload>>(
      `/public/${encodeURIComponent(publicToken)}`,
    );
    return unwrapData(data);
  },

  async verifyInteraction(
    publicToken: string,
    body: { kind: 'lock' | 'question'; attempt: Record<string, unknown> },
  ): Promise<{ valid: boolean }> {
    const { data } = await apiClient.post<ApiSuccessEnvelope<{ valid: boolean }>>(
      `/public/${encodeURIComponent(publicToken)}/verify-interaction`,
      body,
    );
    return unwrapData(data);
  },

  async storeReaction(
    publicToken: string,
    body: Record<string, unknown>,
  ): Promise<Reaction> {
    const { data } = await apiClient.post<ApiSuccessEnvelope<Reaction>>(
      `/public/${encodeURIComponent(publicToken)}/reactions`,
      body,
    );
    return unwrapData(data);
  },
};
