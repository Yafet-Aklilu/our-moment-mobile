import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'ourmoment.auth.token';

/**
 * Secure token storage. Uses SecureStore on native.
 * Web fallback is session-only memory (dev) — never AsyncStorage for secrets.
 */
let memoryToken: string | null = null;

export async function getAuthToken(): Promise<string | null> {
  if (Platform.OS === 'web') {
    return memoryToken;
  }
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function setAuthToken(token: string): Promise<void> {
  if (Platform.OS === 'web') {
    memoryToken = token;
    return;
  }
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function clearAuthToken(): Promise<void> {
  if (Platform.OS === 'web') {
    memoryToken = null;
    return;
  }
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}
