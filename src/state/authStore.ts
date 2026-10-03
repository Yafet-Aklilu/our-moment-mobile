import { create } from 'zustand';

import { setUnauthorizedHandler } from '@/api/client';
import { clearAuthToken, getAuthToken, setAuthToken } from '@/api/tokenStorage';
import { meApi } from '@/api/resources/auth';
import type { User } from '@/types/api';

type AuthStatus = 'bootstrapping' | 'authenticated' | 'anonymous';

type AuthState = {
  status: AuthStatus;
  token: string | null;
  user: User | null;
  bootstrap: () => Promise<void>;
  hydrateSession: (token: string, user: User) => Promise<void>;
  clearSession: () => Promise<void>;
  setUser: (user: User) => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'bootstrapping',
  token: null,
  user: null,

  bootstrap: async () => {
    setUnauthorizedHandler(() => {
      void get().clearSession();
    });

    const token = await getAuthToken();
    if (!token) {
      set({ status: 'anonymous', token: null, user: null });
      return;
    }

    try {
      const user = await meApi.get();
      set({ status: 'authenticated', token, user });
    } catch {
      await clearAuthToken();
      set({ status: 'anonymous', token: null, user: null });
    }
  },

  hydrateSession: async (token, user) => {
    await setAuthToken(token);
    set({ status: 'authenticated', token, user });
  },

  clearSession: async () => {
    await clearAuthToken();
    set({ status: 'anonymous', token: null, user: null });
  },

  setUser: (user) => set({ user }),
}));
