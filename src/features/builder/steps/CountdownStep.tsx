import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ApiClientError } from '@/api/client';
import {
  useDeleteMomentMediaMutation,
  useUpdateMomentSettingsMutation,
  useUploadMomentMediaMutation,
} from '@/api/hooks/useMoments';
import { BuilderSaveStatus } from '@/features/builder/BuilderSaveStatus';
import { asSettings } from '@/features/builder/contentHelpers';
import { COUNTDOWN_STYLES, JOURNEY_END_STEP_ID, JOURNEY_HEAD_STEP_ID } from '@/features/builder/experienceOptions';
import { absoluteMediaUrl, mediaAuthHeaders } from '@/features/builder/mediaUrl';
import { useAutosaveStatus } from '@/features/builder/useAutosaveStatus';
import { ChoiceChips } from '@/features/builder/ui/ChoiceChips';
import { ToggleRow } from '@/features/builder/ui/ToggleRow';
import { compressImageForUpload, pickImagesFromLibrary } from '@/media/picker';
import { colors, radii, spacing, typography } from '@/theme';
import type { MediaItem, Moment } from '@/types/api';

type Props = {
  moment: Moment;
};

const MAX_DURATION = 600;
const MAX_TEXT = 120;

/** Experience: Countdown. Gate: duration required before persisting while enabled. */
export function CountdownStep({ moment }: Props) {
  const readOnly = moment.state === 'activated';
  const mutation = useUpdateMomentSettingsMutation(moment.id);
  const { status, errorMessage, run } = useAutosaveStatus(readOnly);

  const settings = asSettings(moment);
  const countdown =
    settings.countdown && typeof settings.countdown === 'object'
      ? (settings.countdown as Record<string, unknown>)
      : {};

  const [enabled, setEnabled] = useState(Boolean(countdown.enabled));
  const [styleId, setStyleId] = useState(typeof countdown.style === 'string' ? countdown.style : 'circle');
  const [duration, setDuration] = useState(
    typeof countdown.duration === 'number' ? String(countdown.duration) : '',
  );
  const [text, setText] = useState(typeof countdown.text === 'string' ? countdown.text : '');
  const [gateHint, setGateHint] = useState<string | null>(null);

  const persist = (next: { enabled: boolean; style: string; duration: string; text: string }) => {
    const durationNum = next.duration.trim() === '' ? null : Number(next.duration.trim());
    const validDuration =
      durationNum != null && Number.isInteger(durationNum) && durationNum >= 1 && durationNum <= MAX_DURATION;

    if (next.enabled && !validDuration) {
      setGateHint('Set a duration (1–600 seconds) to save the countdown.');
      return;
    }
    setGateHint(null);

    void run(async () => {
      await mutation.mutateAsync({
        ...settings,
        countdown: {
          enabled: next.enabled,
          style: next.style,
          duration: validDuration ? durationNum : undefined,
          text: next.text.trim() || undefined,
        },
      });
    });
  };

  const onToggle = (next: boolean) => {
    setEnabled(next);
    persist({ enabled: next, style: styleId, duration, text });
  };

  const onStyleSelect = (next: string) => {
    setStyleId(next);
    persist({ enabled, style: next, duration, text });
  };

  const onDurationBlur = () => persist({ enabled, style: styleId, duration, text });
  const onTextBlur = () => persist({ enabled, style: styleId, duration, text });

  const journeyHead = (moment.media ?? []).find((m) => m.step_id === JOURNEY_HEAD_STEP_ID) ?? null;
  const journeyEnd = (moment.media ?? []).find((m) => m.step_id === JOURNEY_END_STEP_ID) ?? null;

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Countdown</Text>
      <Text style={styles.sub}>A short wait before your message shows up.</Text>

      <ToggleRow label="Enable countdown" value={enabled} onChange={onToggle} disabled={readOnly} />

      {enabled ? (
        <View style={styles.section}>
          <Text style={styles.label}>Style</Text>
          <ChoiceChips options={COUNTDOWN_STYLES} value={styleId} onChange={onStyleSelect} disabled={readOnly} />

          <Text style={styles.label}>Duration (seconds)</Text>
          <TextInput
            value={duration}
            onChangeText={setDuration}
            onBlur={onDurationBlur}
            editable={!readOnly}
            keyboardType="number-pad"
            placeholder="10"
            placeholderTextColor={colors.light.textMuted}
            style={styles.numberInput}
          />

          <Text style={styles.label}>Custom text</Text>
          <TextInput
            value={text}
            onChangeText={setText}
            onBlur={onTextBlur}
            editable={!readOnly}
            maxLength={MAX_TEXT}
            placeholder="The surprise starts in…"
            placeholderTextColor={colors.light.textMuted}
            style={styles.textInput}
          />

          {styleId === 'journey' ? (
            <View style={styles.journeyRow}>
              <JourneyImageSlot
                label="Moving image"
                stepId={JOURNEY_HEAD_STEP_ID}
                media={journeyHead}
                momentId={moment.id}
                disabled={readOnly}
              />
              <JourneyImageSlot
                label="Destination image"
                stepId={JOURNEY_END_STEP_ID}
                media={journeyEnd}
                momentId={moment.id}
                disabled={readOnly}
              />
            </View>
          ) : null}

          {gateHint ? <Text style={styles.gateHint}>{gateHint}</Text> : null}
        </View>
      ) : null}

      <BuilderSaveStatus status={status} errorMessage={errorMessage} readOnly={readOnly} />
    </View>
  );
}

function JourneyImageSlot({
  label,
  stepId,
  media,
  momentId,
  disabled,
}: {
  label: string;
  stepId: string;
  media: MediaItem | null;
  momentId: number;
  disabled: boolean;
}) {
  const uploadMutation = useUploadMomentMediaMutation(momentId);
  const deleteMutation = useDeleteMomentMediaMutation(momentId);
  const [uploading, setUploading] = useState(false);
  const [headers, setHeaders] = useState<Record<string, string>>({});

  useEffect(() => {
    let alive = true;
    void mediaAuthHeaders().then((h) => {
      if (alive) setHeaders(h);
    });
    return () => {
      alive = false;
    };
  }, []);

  const url = media ? absoluteMediaUrl(media.url) : null;

  const upload = async () => {
    if (disabled) return;
    let picked;
    try {
      picked = await pickImagesFromLibrary({ allowsMultipleSelection: false, selectionLimit: 1 });
    } catch {
      Alert.alert('Photos unavailable', 'We couldn’t open your photo library.');
      return;
    }
    const asset = picked[0];
    if (!asset) return;

    setUploading(true);
    try {
      const compressed = await compressImageForUpload(asset.uri);
      await uploadMutation.mutateAsync({
        stepId,
        uri: compressed.uri,
        mimeType: 'image/jpeg',
        fileName: asset.fileName,
        order: 0,
      });
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : 'Upload failed.';
      Alert.alert('Upload failed', message);
    } finally {
      setUploading(false);
    }
  };

  const remove = () => {
    if (!media) return;
    Alert.alert('Remove image?', 'This can’t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteMutation.mutate(media.id) },
    ]);
  };

  return (
    <View style={styles.journeySlot}>
      <Text style={styles.journeyLabel}>{label}</Text>
      {url ? (
        <View>
          <Image source={{ uri: url, headers }} style={styles.journeyImage} contentFit="cover" />
          <Pressable onPress={remove} disabled={disabled} style={styles.journeyRemove}>
            <Ionicons name="trash-outline" size={16} color="#fff" />
          </Pressable>
        </View>
      ) : (
        <Pressable
          onPress={() => void upload()}
          disabled={disabled || uploading}
          style={[styles.journeyUpload, (disabled || uploading) && styles.journeyUploadDisabled]}
        >
          {uploading ? (
            <ActivityIndicator color={colors.brand.pinkDeep} />
          ) : (
            <Text style={styles.journeyUploadText}>Upload</Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.md,
  },
  title: {
    ...typography.titleSmall,
  },
  sub: {
    ...typography.body,
    color: colors.light.textSecondary,
    marginTop: -spacing.sm,
  },
  section: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.light.text,
    marginTop: spacing.xs,
  },
  numberInput: {
    ...typography.body,
    borderWidth: 1.5,
    borderColor: colors.light.borderStrong,
    borderRadius: radii.md,
    backgroundColor: colors.light.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.light.text,
  },
  textInput: {
    ...typography.body,
    borderWidth: 1.5,
    borderColor: colors.light.borderStrong,
    borderRadius: radii.md,
    backgroundColor: colors.light.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    color: colors.light.text,
  },
  gateHint: {
    ...typography.caption,
    color: colors.brand.pinkDeep,
  },
  journeyRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  journeySlot: {
    flex: 1,
    gap: spacing.xs,
  },
  journeyLabel: {
    ...typography.caption,
    color: colors.light.textSecondary,
  },
  journeyImage: {
    width: '100%',
    height: 100,
    borderRadius: radii.md,
    backgroundColor: colors.light.surfaceMuted,
  },
  journeyRemove: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(28,24,20,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  journeyUpload: {
    height: 100,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.light.borderStrong,
    backgroundColor: colors.light.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  journeyUploadDisabled: {
    opacity: 0.5,
  },
  journeyUploadText: {
    ...typography.label,
    color: colors.brand.pinkDeep,
  },
});
