import { apiClient, unwrapData } from '@/api/client';
import type {
  ActivationStatus,
  ApiSuccessEnvelope,
  MediaItem,
  Moment,
  MomentPreview,
  MomentState,
  MomentSummary,
  ReactionsInbox,
} from '@/types/api';

type MomentsListResponse = {
  data: MomentSummary[];
  links?: unknown;
  meta?: Record<string, unknown>;
};

export const momentsApi = {
  async list(params?: { state?: MomentState; page?: number }) {
    const { data } = await apiClient.get<MomentsListResponse>('/moments', {
      params,
    });
    return data;
  },

  async get(id: number): Promise<Moment> {
    const { data } = await apiClient.get<ApiSuccessEnvelope<Moment>>(
      `/moments/${id}`,
    );
    return unwrapData(data);
  },

  async start(templateId: number): Promise<Moment> {
    const { data } = await apiClient.post<ApiSuccessEnvelope<Moment>>(
      '/moments/start',
      { template_id: templateId },
    );
    return unwrapData(data);
  },

  async remove(id: number): Promise<{ deleted: true }> {
    const { data } = await apiClient.delete<ApiSuccessEnvelope<{ deleted: true }>>(
      `/moments/${id}`,
    );
    return unwrapData(data);
  },

  async preview(id: number): Promise<MomentPreview> {
    const { data } = await apiClient.get<ApiSuccessEnvelope<MomentPreview>>(
      `/moments/${id}/preview`,
    );
    return unwrapData(data);
  },

  async activationStatus(id: number): Promise<ActivationStatus> {
    const { data } = await apiClient.get<ApiSuccessEnvelope<ActivationStatus>>(
      `/moments/${id}/activation-status`,
    );
    return unwrapData(data);
  },

  async reactions(id: number): Promise<ReactionsInbox> {
    const { data } = await apiClient.get<ApiSuccessEnvelope<ReactionsInbox>>(
      `/moments/${id}/reactions`,
    );
    return unwrapData(data);
  },

  async activate(id: number): Promise<Record<string, unknown>> {
    const { data } = await apiClient.post<ApiSuccessEnvelope<Record<string, unknown>>>(
      `/moments/${id}/activate`,
    );
    return unwrapData(data);
  },

  async duplicate(id: number): Promise<Moment> {
    const { data } = await apiClient.post<ApiSuccessEnvelope<Moment>>(
      `/moments/${id}/duplicate`,
    );
    return unwrapData(data);
  },

  async revokeLink(id: number): Promise<Record<string, unknown>> {
    const { data } = await apiClient.post<ApiSuccessEnvelope<Record<string, unknown>>>(
      `/moments/${id}/revoke-link`,
    );
    return unwrapData(data);
  },

  async rotateLink(id: number): Promise<Record<string, unknown>> {
    const { data } = await apiClient.post<ApiSuccessEnvelope<Record<string, unknown>>>(
      `/moments/${id}/rotate-link`,
    );
    return unwrapData(data);
  },

  async updateNames(
    id: number,
    payload: { sender_name?: string | null; receiver_name?: string | null },
  ): Promise<{
    saved: true;
    sender_name: string | null;
    receiver_name: string | null;
  }> {
    const { data } = await apiClient.patch<
      ApiSuccessEnvelope<{
        saved: true;
        sender_name: string | null;
        receiver_name: string | null;
      }>
    >(`/moments/${id}/names`, payload);
    return unwrapData(data);
  },

  async saveStep(
    id: number,
    stepId: string,
    payload: {
      value: unknown;
      type: 'text' | 'date' | 'image' | 'audio' | 'video';
      is_autosave?: boolean;
    },
  ): Promise<{
    saved: true;
    step_id: string;
    completed_steps: unknown;
    next_step: string | null;
    can_publish: boolean;
    missing_steps: string[];
  }> {
    const { data } = await apiClient.put<
      ApiSuccessEnvelope<{
        saved: true;
        step_id: string;
        completed_steps: unknown;
        next_step: string | null;
        can_publish: boolean;
        missing_steps: string[];
      }>
    >(`/moments/${id}/steps/${encodeURIComponent(stepId)}`, payload);
    return unwrapData(data);
  },

  async updateTheme(
    id: number,
    payload: {
      background?: string | null;
      text?: string | null;
      primary?: string | null;
      fontFamily?: string | null;
    },
  ): Promise<{ saved: true; theme: unknown }> {
    const { data } = await apiClient.patch<
      ApiSuccessEnvelope<{ saved: true; theme: unknown }>
    >(`/moments/${id}/theme`, payload);
    return unwrapData(data);
  },

  async updateSettings(
    id: number,
    settings: Record<string, unknown>,
  ): Promise<{ saved: true; settings: Record<string, unknown> }> {
    const { data } = await apiClient.patch<
      ApiSuccessEnvelope<{ saved: true; settings: Record<string, unknown> }>
    >(`/moments/${id}/settings`, { settings });
    return unwrapData(data);
  },

  async uploadMedia(
    id: number,
    params: {
      stepId: string;
      uri: string;
      mimeType?: string | null;
      fileName?: string | null;
      order?: number;
    },
  ): Promise<MediaItem> {
    const form = new FormData();
    form.append('step_id', params.stepId);
    if (params.order != null) {
      form.append('order', String(params.order));
    }
    const name = params.fileName || `upload-${Date.now()}.jpg`;
    form.append('file', {
      uri: params.uri,
      name,
      type: params.mimeType || 'image/jpeg',
    } as unknown as Blob);

    const { data } = await apiClient.post<ApiSuccessEnvelope<MediaItem>>(
      `/moments/${id}/media`,
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120_000,
      },
    );
    return unwrapData(data);
  },

  async reorderMedia(
    id: number,
    payload: { step_id: string; media_ids: number[] },
  ): Promise<{ reordered: true }> {
    const { data } = await apiClient.patch<
      ApiSuccessEnvelope<{ reordered: true }>
    >(`/moments/${id}/media/reorder`, payload);
    return unwrapData(data);
  },

  async updateMedia(
    id: number,
    mediaId: number,
    payload: { caption?: string | null; description?: string | null },
  ): Promise<{ saved: true; media: MediaItem }> {
    const { data } = await apiClient.patch<
      ApiSuccessEnvelope<{ saved: true; media: MediaItem }>
    >(`/moments/${id}/media/${mediaId}`, payload);
    return unwrapData(data);
  },

  async deleteMedia(id: number, mediaId: number): Promise<{ deleted: true }> {
    const { data } = await apiClient.delete<
      ApiSuccessEnvelope<{ deleted: true }>
    >(`/moments/${id}/media/${mediaId}`);
    return unwrapData(data);
  },
};
