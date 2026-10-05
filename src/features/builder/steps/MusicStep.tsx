import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ApiClientError } from '@/api/client';
import {
  useDeleteMomentMediaMutation,
  useUpdateMomentSettingsMutation,
  useUploadMomentMediaMutation,
} from '@/api/hooks/useMoments';
import { PageIntro } from '@/components/ui/PageIntro';
import { BuilderSaveStatus } from '@/features/builder/BuilderSaveStatus';
import { asSettings, findAudioStepId } from '@/features/builder/contentHelpers';
import { EXPERIENCE_SOUND_STEP_ID } from '@/features/builder/experienceOptions';
import { useAutosaveStatus } from '@/features/builder/useAutosaveStatus';
import { ChoiceChips } from '@/features/builder/ui/ChoiceChips';
import { colors, radii, spacing, typography } from '@/theme';
import type { Moment } from '@/types/api';

type Props = {
  moment: Moment;
};

const MODE_OPTIONS = [
  { id: 'none', label: 'No sound' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'upload', label: 'Upload' },
] as const;

const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/i;

/** Experience: Music. Mobile supports YouTube link or a direct audio upload (no catalog API yet). */
export function MusicStep({ moment }: Props) {
  const readOnly = moment.state === 'activated';
  const settingsMutation = useUpdateMomentSettingsMutation(moment.id);
  const uploadMutation = useUploadMomentMediaMutation(moment.id);
  const deleteMutation = useDeleteMomentMediaMutation(moment.id);
  const { status, errorMessage, run } = useAutosaveStatus(readOnly);

  const settings = asSettings(moment);
  const sound = settings.sound && typeof settings.sound === 'object' ? (settings.sound as Record<string, unknown>) : null;
  const soundType = sound && typeof sound.type === 'string' ? sound.type : null;

  const stepId = findAudioStepId(moment) ?? EXPERIENCE_SOUND_STEP_ID;
  const audioMedia = (moment.media ?? []).filter((m) => m.step_id === stepId);

  const [mode, setMode] = useState<string>(() => {
    if (audioMedia.length > 0) return 'upload';
    if (soundType === 'youtube') return 'youtube';
    return 'none';
  });
  const [youtubeUrl, setYoutubeUrl] = useState(
    soundType === 'youtube' && typeof sound?.url === 'string' ? sound.url : '',
  );
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const onModeChange = (next: string) => {
    setMode(next);
    if (next === 'none') {
      void run(async () => {
        await settingsMutation.mutateAsync({ ...settings, sound: null });
      });
    }
  };

  const onYoutubeBlur = () => {
    const trimmed = youtubeUrl.trim();
    if (!trimmed) {
      setYoutubeError(null);
      return;
    }
    if (!YOUTUBE_REGEX.test(trimmed)) {
      setYoutubeError('Enter a valid YouTube URL (youtube.com/watch?v=… or youtu.be/…).');
      return;
    }
    setYoutubeError(null);
    void run(async () => {
      await settingsMutation.mutateAsync({ ...settings, sound: { type: 'youtube', url: trimmed } });
    });
  };

  const upload = async () => {
    if (readOnly) return;
    let result: DocumentPicker.DocumentPickerResult;
    try {
      result = await DocumentPicker.getDocumentAsync({ type: 'audio/*', copyToCacheDirectory: true });
    } catch {
      Alert.alert('Files unavailable', 'We couldn’t open the file picker.');
      return;
    }
    if (result.canceled || !result.assets[0]) return;
    const asset = result.assets[0];

    setUploading(true);
    try {
      await uploadMutation.mutateAsync({
        stepId,
        uri: asset.uri,
        mimeType: asset.mimeType ?? 'audio/mpeg',
        fileName: asset.name,
      });
      if (sound) {
        await settingsMutation.mutateAsync({ ...settings, sound: null });
      }
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : 'Upload failed.';
      Alert.alert('Upload failed', message);
    } finally {
      setUploading(false);
    }
  };

  const removeAudio = (mediaId: number) => {
    Alert.alert('Remove sound?', 'This can’t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteMutation.mutate(mediaId) },
    ]);
  };

  return (
    <View style={styles.root}>
      <PageIntro
        title="Music"
        body="Add a song — yours, or a YouTube link."
        style={styles.intro}
      />

      {soundType === 'catalog' ? (
        <View style={styles.noteCard}>
          <Text style={styles.noteText}>
            A catalog sound is selected on web. Catalog sounds aren’t on the mobile API yet — choose YouTube or
            upload below to change it here.
          </Text>
        </View>
      ) : null}

      <ChoiceChips options={MODE_OPTIONS} value={mode} onChange={onModeChange} disabled={readOnly} />

      {mode === 'none' ? (
        <Text style={styles.hint}>
          Your moment plays in silence. If you’ve uploaded a file below, remove it too so nothing plays.
        </Text>
      ) : null}

      {mode === 'youtube' ? (
        <View style={styles.section}>
          <TextInput
            value={youtubeUrl}
            onChangeText={setYoutubeUrl}
            onBlur={onYoutubeBlur}
            editable={!readOnly}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            placeholder="https://www.youtube.com/watch?v=…"
            placeholderTextColor={colors.light.textMuted}
            style={styles.textInput}
          />
          {youtubeError ? <Text style={styles.errorText}>{youtubeError}</Text> : null}
        </View>
      ) : null}

      {mode === 'upload' ? (
        <View style={styles.section}>
          {audioMedia.length > 0 ? (
            audioMedia.map((item) => (
              <View key={item.id} style={styles.audioCard}>
                <Ionicons name="musical-notes" size={20} color={colors.brand.pinkDeep} />
                <Text style={styles.audioName} numberOfLines={1}>
                  {item.original_filename || 'Uploaded sound'}
                </Text>
                <Pressable onPress={() => removeAudio(item.id)} disabled={readOnly} hitSlop={8}>
                  <Ionicons name="trash-outline" size={18} color={colors.light.danger} />
                </Pressable>
              </View>
            ))
          ) : (
            <Pressable
              onPress={() => void upload()}
              disabled={readOnly || uploading}
              style={[styles.uploadZone, (readOnly || uploading) && styles.uploadZoneDisabled]}
            >
              {uploading ? (
                <ActivityIndicator color={colors.brand.pinkDeep} />
              ) : (
                <>
                  <Ionicons name="cloud-upload-outline" size={22} color={colors.brand.pinkDeep} />
                  <Text style={styles.uploadZoneText}>Upload your own sound</Text>
                </>
              )}
            </Pressable>
          )}
        </View>
      ) : null}

      <BuilderSaveStatus status={status} errorMessage={errorMessage} readOnly={readOnly} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.lg,
  },
  intro: {
    marginBottom: 0,
  },
  section: {
    gap: spacing.sm,
  },
  noteCard: {
    padding: spacing.lg,
    borderRadius: radii.xl,
    backgroundColor: colors.light.surfaceMuted,
  },
  noteText: {
    ...typography.caption,
    color: colors.light.textSecondary,
    lineHeight: 18,
  },
  hint: {
    ...typography.caption,
    fontSize: 12,
    color: colors.light.textMuted,
  },
  textInput: {
    ...typography.body,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: radii.lg,
    backgroundColor: colors.light.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.light.text,
  },
  errorText: {
    ...typography.caption,
    color: colors.light.danger,
  },
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
  },
  audioName: {
    ...typography.label,
    flex: 1,
    color: colors.light.text,
  },
  uploadZone: {
    minHeight: 108,
    borderRadius: radii.xl,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: 'rgba(255, 108, 113, 0.28)',
    backgroundColor: colors.light.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  uploadZoneDisabled: {
    opacity: 0.5,
  },
  uploadZoneText: {
    ...typography.label,
    color: colors.brand.pinkDeep,
  },
});
