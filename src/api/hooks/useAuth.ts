import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { authApi, meApi, type LoginInput, type RegisterInput } from '@/api/resources/auth';
import { useAuthStore } from '@/state/authStore';

export const queryKeys = {
  me: ['me'] as const,
  moments: (state?: string) => ['moments', state ?? 'all'] as const,
  moment: (id: number) => ['moments', id] as const,
  templates: ['templates'] as const,
  template: (id: number) => ['templates', id] as const,
  credits: ['credits'] as const,
  publicMoment: (token: string) => ['public', token] as const,
};

export function useMeQuery(enabled = true) {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: () => meApi.get(),
    enabled,
  });
}

export function useLoginMutation() {
  const hydrateSession = useAuthStore((s) => s.hydrateSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: LoginInput) => authApi.login(input),
    onSuccess: async (payload) => {
      await hydrateSession(payload.token, payload.user);
      queryClient.setQueryData(queryKeys.me, payload.user);
    },
  });
}

export function useRegisterMutation() {
  const hydrateSession = useAuthStore((s) => s.hydrateSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: RegisterInput) => authApi.register(input),
    onSuccess: async (payload) => {
      await hydrateSession(payload.token, payload.user);
      queryClient.setQueryData(queryKeys.me, payload.user);
    },
  });
}

export function useLogoutMutation() {
  const clearSession = useAuthStore((s) => s.clearSession);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await authApi.logout();
      } finally {
        await clearSession();
        queryClient.clear();
      }
    },
  });
}

export function useForgotPasswordMutation() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

export function useResetPasswordMutation() {
  return useMutation({
    mutationFn: authApi.resetPassword,
  });
}
