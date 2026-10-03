import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { momentsApi } from '@/api/resources/moments';
import { templatesApi } from '@/api/resources/templates';
import { creditsApi } from '@/api/resources/credits';
import { publicApi } from '@/api/resources/public';
import type { MediaItem, Moment, MomentState } from '@/types/api';

import { queryKeys } from './useAuth';

export function useMomentsQuery(state?: MomentState) {
  return useQuery({
    queryKey: queryKeys.moments(state),
    queryFn: () => momentsApi.list({ state }),
  });
}

export function useMomentQuery(id: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.moment(id),
    queryFn: () => momentsApi.get(id),
    enabled: enabled && Number.isFinite(id),
  });
}

export function useTemplatesQuery() {
  return useQuery({
    queryKey: queryKeys.templates,
    queryFn: async () => {
      const page = await templatesApi.list({ per_page: 50 });
      return page.data;
    },
  });
}

export function useCreditsQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.credits,
    queryFn: () => creditsApi.balance(),
    enabled,
  });
}

export function usePublicMomentQuery(publicToken: string, enabled = true) {
  return useQuery({
    queryKey: queryKeys.publicMoment(publicToken),
    queryFn: () => publicApi.get(publicToken),
    enabled: enabled && publicToken.length > 0,
  });
}

function invalidateMoment(queryClient: ReturnType<typeof useQueryClient>, momentId: number) {
  void queryClient.invalidateQueries({ queryKey: queryKeys.moment(momentId) });
  void queryClient.invalidateQueries({ queryKey: ['moments'] });
  void queryClient.invalidateQueries({ queryKey: ['moments', momentId, 'preview'] });
}

export function useUpdateMomentNamesMutation(momentId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: {
      sender_name?: string | null;
      receiver_name?: string | null;
    }) => momentsApi.updateNames(momentId, payload),
    onSuccess: (result) => {
      queryClient.setQueryData<Moment>(queryKeys.moment(momentId), (prev) =>
        prev
          ? {
              ...prev,
              sender_name: result.sender_name,
              receiver_name: result.receiver_name,
            }
          : prev,
      );
      void queryClient.invalidateQueries({ queryKey: ['moments'] });
    },
  });
}

export function useSaveMomentStepMutation(momentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      stepId: string;
      value: unknown;
      type: 'text' | 'date' | 'image' | 'audio' | 'video';
      is_autosave?: boolean;
    }) =>
      momentsApi.saveStep(momentId, input.stepId, {
        value: input.value,
        type: input.type,
        is_autosave: input.is_autosave ?? true,
      }),
    onSuccess: () => invalidateMoment(queryClient, momentId),
  });
}

export function useUpdateMomentSettingsMutation(momentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (settings: Record<string, unknown>) =>
      momentsApi.updateSettings(momentId, settings),
    onSuccess: (result) => {
      queryClient.setQueryData<Moment>(queryKeys.moment(momentId), (prev) =>
        prev ? { ...prev, settings: result.settings } : prev,
      );
      invalidateMoment(queryClient, momentId);
    },
  });
}

export function useUpdateMomentThemeMutation(momentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      background?: string | null;
      text?: string | null;
      primary?: string | null;
      fontFamily?: string | null;
    }) => momentsApi.updateTheme(momentId, payload),
    onSuccess: (result) => {
      queryClient.setQueryData<Moment>(queryKeys.moment(momentId), (prev) =>
        prev ? { ...prev, theme: result.theme } : prev,
      );
      invalidateMoment(queryClient, momentId);
    },
  });
}

export function useUploadMomentMediaMutation(momentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: {
      stepId: string;
      uri: string;
      mimeType?: string | null;
      fileName?: string | null;
      order?: number;
    }) => momentsApi.uploadMedia(momentId, params),
    onSuccess: (media: MediaItem) => {
      queryClient.setQueryData<Moment>(queryKeys.moment(momentId), (prev) => {
        if (!prev) return prev;
        const existing = prev.media ?? [];
        return { ...prev, media: [...existing, media] };
      });
      invalidateMoment(queryClient, momentId);
    },
  });
}

export function useDeleteMomentMediaMutation(momentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mediaId: number) => momentsApi.deleteMedia(momentId, mediaId),
    onSuccess: (_res, mediaId) => {
      queryClient.setQueryData<Moment>(queryKeys.moment(momentId), (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          media: (prev.media ?? []).filter((m) => m.id !== mediaId),
        };
      });
      invalidateMoment(queryClient, momentId);
    },
  });
}

export function useUpdateMomentMediaMutation(momentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: {
      mediaId: number;
      caption?: string | null;
      description?: string | null;
    }) =>
      momentsApi.updateMedia(momentId, input.mediaId, {
        caption: input.caption,
        description: input.description,
      }),
    onSuccess: (result) => {
      queryClient.setQueryData<Moment>(queryKeys.moment(momentId), (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          media: (prev.media ?? []).map((m) =>
            m.id === result.media.id ? result.media : m,
          ),
        };
      });
      invalidateMoment(queryClient, momentId);
    },
  });
}

export function useReorderMomentMediaMutation(momentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { step_id: string; media_ids: number[] }) =>
      momentsApi.reorderMedia(momentId, payload),
    onSuccess: () => invalidateMoment(queryClient, momentId),
  });
}
