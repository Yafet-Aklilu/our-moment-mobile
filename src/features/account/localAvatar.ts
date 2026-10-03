import * as FileSystem from 'expo-file-system/legacy';
import * as ImagePicker from 'expo-image-picker';

import { compressImageForUpload, ensureLibraryPermission } from '@/media/picker';

/**
 * Pick a single profile photo and copy it into the app document directory
 * so it survives app restarts. Device-local only — not uploaded to the API.
 */
export async function pickAndPersistLocalAvatar(userId: number): Promise<string> {
  const granted = await ensureLibraryPermission();
  if (!granted) {
    throw new Error('Photo library permission is required.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: false,
    quality: 1,
    exif: false,
  });

  if (result.canceled || !result.assets[0]) {
    throw new Error('cancelled');
  }

  const compressed = await compressImageForUpload(result.assets[0].uri, 720);
  const base = FileSystem.documentDirectory;
  if (!base) {
    return compressed.uri;
  }

  const dest = `${base}profile-avatar-${userId}.jpg`;
  const info = await FileSystem.getInfoAsync(dest);
  if (info.exists) {
    await FileSystem.deleteAsync(dest, { idempotent: true });
  }
  await FileSystem.copyAsync({ from: compressed.uri, to: dest });
  return dest;
}
