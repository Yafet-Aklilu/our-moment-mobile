import { apiClient, unwrapData } from '@/api/client';
import type { ApiSuccessEnvelope, CreditsBalance } from '@/types/api';

export const creditsApi = {
  async balance(): Promise<CreditsBalance> {
    const { data } = await apiClient.get<ApiSuccessEnvelope<CreditsBalance>>(
      '/credits/balance',
    );
    return unwrapData(data);
  },
};

export const paymentsApi = {
  async initiate(momentId: number): Promise<Record<string, unknown>> {
    const { data } = await apiClient.post<ApiSuccessEnvelope<Record<string, unknown>>>(
      '/payments/initiate',
      { moment_id: momentId },
    );
    return unwrapData(data);
  },

  async status(txRef: string): Promise<Record<string, unknown>> {
    const { data } = await apiClient.get<ApiSuccessEnvelope<Record<string, unknown>>>(
      '/payments/status',
      { params: { tx_ref: txRef } },
    );
    return unwrapData(data);
  },
};
