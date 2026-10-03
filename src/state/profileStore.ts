import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

const keyFor = (userId: number) => `ourmoment.profile.avatar.${userId}`;

export type AvatarKind = 'illustration' | 'local-photo';

export type ProfileAvatar = {
  kind: AvatarKind;
  /** Built-in illustration id when kind === 'illustration' */
  illustrationId?: string;
  /** Device-local file URI when kind === 'local-photo' — not synced to server */
  localUri?: string;
};

type ProfileState = {
  userId: number | null;
  avatar: ProfileAvatar | null;
  hydrated: boolean;
  hydrate: (userId: number) => Promise<void>;
  setIllustration: (userId: number, illustrationId: string) => Promise<void>;
  setLocalPhoto: (userId: number, localUri: string) => Promise<void>;
  clearAvatar: (userId: number) => Promise<void>;
};

async function persist(userId: number, avatar: ProfileAvatar | null) {
  const key = keyFor(userId);
  if (!avatar) {
    await AsyncStorage.removeItem(key);
    return;
  }
  await AsyncStorage.setItem(key, JSON.stringify(avatar));
}

/**
 * Device-local profile presentation preferences.
 * Separate from auth — does NOT mean the API supports avatars.
 */
export const useProfileStore = create<ProfileState>((set) => ({
  userId: null,
  avatar: null,
  hydrated: false,

  hydrate: async (userId) => {
    try {
      const raw = await AsyncStorage.getItem(keyFor(userId));
      const avatar = raw ? (JSON.parse(raw) as ProfileAvatar) : null;
      set({ userId, avatar, hydrated: true });
    } catch {
      set({ userId, avatar: null, hydrated: true });
    }
  },

  setIllustration: async (userId, illustrationId) => {
    const avatar: ProfileAvatar = { kind: 'illustration', illustrationId };
    await persist(userId, avatar);
    set({ userId, avatar });
  },

  setLocalPhoto: async (userId, localUri) => {
    const avatar: ProfileAvatar = { kind: 'local-photo', localUri };
    await persist(userId, avatar);
    set({ userId, avatar });
  },

  clearAvatar: async (userId) => {
    await persist(userId, null);
    set({ userId, avatar: null });
  },
}));
