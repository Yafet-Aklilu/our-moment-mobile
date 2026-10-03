/**
 * Media foundation — picker / camera / compression hooks for the future editor.
 * Not a full Moment builder; ensures architecture is ready.
 */
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export type PickedImage = {
  uri: string;
  width?: number;
  height?: number;
  mimeType?: string | null;
  fileName?: string | null;
  fileSize?: number | null;
};

export async function ensureLibraryPermission(): Promise<boolean> {
  const current = await ImagePicker.getMediaLibraryPermissionsAsync();
  if (current.granted) return true;
  const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
  return requested.granted;
}

export async function ensureCameraPermission(): Promise<boolean> {
  const current = await ImagePicker.getCameraPermissionsAsync();
  if (current.granted) return true;
  const requested = await ImagePicker.requestCameraPermissionsAsync();
  return requested.granted;
}

export async function pickImagesFromLibrary(options?: {
  allowsMultipleSelection?: boolean;
  selectionLimit?: number;
}): Promise<PickedImage[]> {
  const granted = await ensureLibraryPermission();
  if (!granted) {
    throw new Error('Photo library permission is required.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: options?.allowsMultipleSelection ?? true,
    selectionLimit: options?.selectionLimit ?? 12,
    quality: 1,
    exif: false,
  });

  if (result.canceled) return [];

  return result.assets.map((asset) => ({
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    mimeType: asset.mimeType,
    fileName: asset.fileName,
    fileSize: asset.fileSize,
  }));
}

export async function captureImageFromCamera(): Promise<PickedImage | null> {
  const granted = await ensureCameraPermission();
  if (!granted) {
    throw new Error('Camera permission is required.');
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ['images'],
    quality: 1,
    exif: false,
  });

  if (result.canceled || !result.assets[0]) return null;
  const asset = result.assets[0];
  return {
    uri: asset.uri,
    width: asset.width,
    height: asset.height,
    mimeType: asset.mimeType,
    fileName: asset.fileName,
    fileSize: asset.fileSize,
  };
}

/**
 * Compress for upload. Max edge ~1920 keeps quality while reducing payload.
 * Upload progress / retry belong in the media API layer when the editor ships.
 */
export async function compressImageForUpload(
  uri: string,
  maxEdge = 1920,
): Promise<{ uri: string; width: number; height: number }> {
  const manipulated = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxEdge } }],
    { compress: 0.82, format: ImageManipulator.SaveFormat.JPEG },
  );

  return {
    uri: manipulated.uri,
    width: manipulated.width,
    height: manipulated.height,
  };
}
