import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const STORAGE_KEY = 'ourmoment.onboarding.completed';

type OnboardingState = {
  /** null while reading storage */
  completed: boolean | null;
  bootstrap: () => Promise<void>;
  complete: () => Promise<void>;
  /** Dev/test helper — does not affect auth. */
  reset: () => Promise<void>;
};

/**
 * First-run onboarding flag — separate from auth session.
 * Uses AsyncStorage (not SecureStore); this is not a secret.
 */
export const useOnboardingStore = create<OnboardingState>((set) => ({
  completed: null,

  bootstrap: async () => {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      set({ completed: value === '1' });
    } catch {
      set({ completed: false });
    }
  },

  complete: async () => {
    await AsyncStorage.setItem(STORAGE_KEY, '1');
    set({ completed: true });
  },

  reset: async () => {
    await AsyncStorage.removeItem(STORAGE_KEY);
    set({ completed: false });
  },
}));
