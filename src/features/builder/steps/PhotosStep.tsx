import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { ApiClientError } from '@/api/client';
import {
  useDeleteMomentMediaMutation,
  useUpdateMomentMediaMutation,
  useUpdateMomentSettingsMutation,
  useUploadMomentMediaMutation,
} from '@/api/hooks/useMoments';
import { TextField } from '@/components/ui/TextField';
import { BuilderSaveStatus } from '@/features/builder/BuilderSaveStatus';
import { asSettings, findImageStepId, findTemplateSteps } from '@/features/builder/contentHelpers';
import { GALLERY_STYLES } from '@/features/builder/experienceOptions';
import { absoluteMediaUrl, mediaAuthHeaders } from '@/features/builder/mediaUrl';
import { useAutosaveStatus } from '@/features/builder/useAutosaveStatus';
import { ChoiceChips } from '@/features/builder/ui/ChoiceChips';
import { compressImageForUpload, pickImagesFromLibrary, type PickedImage } from '@/media/picker';
import { colors, radii, spacing, typography } from '@/theme';
import type { MediaItem, Moment } from '@/types/api';

type Props = {
  moment: Moment;
};

type PendingUpload = {
  id: string;
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
  status: 'uploading' | 'error';
  error?: string;
};

/** Experience: Photos (gallery style + media management for the template's image step). */
export function PhotosStep({ moment }: Props) {
  const readOnly = moment.state === 'activated';
  const stepId = findImageStepId(moment);
  const imageStep = findTemplateSteps(moment).find((s) => s.type === 'image') ?? null;
  const maxCount = imageStep?.max_count ?? null;

  const settingsMutation = useUpdateMomentSettingsMutation(moment.id);
  const uploadMutation = useUploadMomentMediaMutation(moment.id);
  const deleteMutation = useDeleteMomentMediaMutation(moment.id);
  const updateMediaMutation = useUpdateMomentMediaMutation(moment.id);
  const { status, errorMessage, run } = useAutosaveStatus(readOnly);

  const settings = asSettings(moment);
  const gallery =
    settings.gallery && typeof settings.gallery === 'object' ? (settings.gallery as Record<string, unknown>) : {};
  const galleryStyle = typeof gallery.style === 'string' ? gallery.style : null;

  const media = (moment.media ?? [])
    .filter((m) => m.step_id === stepId)
    .slice()
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

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

  const [pending, setPending] = useState<PendingUpload[]>([]);
  const orderRef = useRef(media.length);

  const onStyleChange = (next: string) => {
    void run(async () => {
      await settingsMutation.mutateAsync({ ...settings, gallery: { ...gallery, style: next } });
    });
  };

  const remainingSlots = maxCount != null ? Math.max(0, maxCount - media.length - pending.length) : undefined;
  const canAddMore = !stepId || readOnly ? false : remainingSlots === undefined || remainingSlots > 0;

  const uploadOne = async (item: PendingUpload) => {
    if (!stepId) return;
    setPending((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: 'uploading', error: undefined } : p)));
    try {
      const compressed = await compressImageForUpload(item.uri);
      const order = orderRef.current;
      orderRef.current += 1;
      await uploadMutation.mutateAsync({
        stepId,
        uri: compressed.uri,
        mimeType: 'image/jpeg',
        fileName: item.fileName,
        order,
      });
      setPending((prev) => prev.filter((p) => p.id !== item.id));
    } catch (err) {
      const message = err instanceof ApiClientError ? err.message : 'Upload failed.';
      setPending((prev) => prev.map((p) => (p.id === item.id ? { ...p, status: 'error', error: message } : p)));
    }
  };

  const addPhotos = async () => {
    if (readOnly || !stepId) return;
    orderRef.current = Math.max(orderRef.current, media.length);
    let picked: PickedImage[] = [];
    try {
      picked = await pickImagesFromLibrary({
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
      });
    } catch {
      Alert.alert('Photos unavailable', 'We couldn’t open your photo library.');
      return;
    }
    if (!picked.length) return;

    const items: PendingUpload[] = picked.map((p, index) => ({
      id: `${Date.now()}-${index}`,
      uri: p.uri,
      fileName: p.fileName,
      mimeType: p.mimeType,
      status: 'uploading',
    }));
    setPending((prev) => [...prev, ...items]);
    // Sequential (not Promise.all) so `order` stays stable per-item and one slow
    // upload doesn't race another for the same order value.
    await items.reduce(
      (chain, item) => chain.then(() => uploadOne(item)),
      Promise.resolve(),
    );
  };

  const retry = (item: PendingUpload) => {
    void uploadOne(item);
  };

  const dismissFailed = (id: string) => {
    setPending((prev) => prev.filter((p) => p.id !== id));
  };

  const onDelete = (mediaId: number) => {
    Alert.alert('Remove photo?', 'This can’t be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          deleteMutation.mutate(mediaId);
        },
      },
    ]);
  };

  const onCaptionBlur = (mediaId: number, caption: string) => {
    updateMediaMutation.mutate({ mediaId, caption: caption.trim() || null });
  };

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Photos</Text>
      <Text style={styles.sub}>Choose how photos show, then add yours.</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Gallery style</Text>
        <ChoiceChips options={GALLERY_STYLES} value={galleryStyle} onChange={onStyleChange} disabled={readOnly} />
        <BuilderSaveStatus status={status} errorMessage={errorMessage} readOnly={readOnly} />
      </View>

      {!stepId ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>This style has no photo step.</Text>
        </View>
      ) : (
        <View style={styles.section}>
          <View style={styles.rowBetween}>
            <Text style={styles.label}>
              Photos · {media.length}
              {maxCount ? ` / ${maxCount}` : ''}
            </Text>
            {canAddMore ? (
              <Pressable onPress={() => void addPhotos()} style={styles.addButton} disabled={readOnly}>
                <Ionicons name="add" size={16} color={colors.brand.pinkDeep} />
                <Text style={styles.addButtonLabel}>Add photos</Text>
              </Pressable>
            ) : null}
          </View>

          {media.length === 0 && pending.length === 0 ? (
            <Pressable
              style={styles.dropzone}
              onPress={() => void addPhotos()}
              disabled={readOnly}
              accessibilityRole="button"
            >
              <Text style={styles.dropzoneText}>Start with your first memory</Text>
              <Text style={styles.dropzoneHint}>Tap to choose photos from your library.</Text>
            </Pressable>
          ) : (
            <View style={styles.grid}>
              {media.map((item, index) => (
                <PhotoCard
                  key={item.id}
                  index={index}
                  media={item}
                  headers={headers}
                  disabled={readOnly}
                  onDelete={() => onDelete(item.id)}
                  onCaptionBlur={(caption) => onCaptionBlur(item.id, caption)}
                />
              ))}
              {pending.map((item) => (
                <View key={item.id} style={styles.pendingCard}>
                  <Image source={{ uri: item.uri }} style={styles.pendingImage} contentFit="cover" />
                  {item.status === 'uploading' ? (
                    <View style={styles.pendingOverlay}>
                      <ActivityIndicator color="#fff" />
                      <Text style={styles.pendingOverlayText}>Uploading…</Text>
                    </View>
                  ) : (
                    <View style={styles.pendingOverlay}>
                      <Text style={styles.pendingErrorText}>{item.error || 'Upload failed'}</Text>
                      <View style={styles.pendingActions}>
                        <Pressable onPress={() => retry(item)} style={styles.pendingActionButton}>
                          <Text style={styles.pendingActionLabel}>Retry</Text>
                        </Pressable>
                        <Pressable onPress={() => dismissFailed(item.id)} style={styles.pendingActionButton}>
                          <Text style={styles.pendingActionLabel}>Remove</Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

          {maxCount != null && media.length >= maxCount ? (
            <Text style={styles.limitText}>You’ve reached the photo limit for this template.</Text>
          ) : null}
        </View>
      )}
    </View>
  );
}

function PhotoCard({
  media,
  index,
  headers,
  disabled,
  onDelete,
  onCaptionBlur,
}: {
  media: MediaItem;
  index: number;
  headers: Record<string, string>;
  disabled: boolean;
  onDelete: () => void;
  onCaptionBlur: (caption: string) => void;
}) {
  const [caption, setCaption] = useState(media.caption ?? '');
  const savedRef = useRef(media.caption ?? '');
  const url = absoluteMediaUrl(media.url);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardIndex}>#{index + 1}</Text>
        <Pressable onPress={onDelete} disabled={disabled} accessibilityRole="button" accessibilityLabel="Remove photo">
          <Ionicons name="trash-outline" size={18} color={colors.light.danger} />
        </Pressable>
      </View>
      {url ? (
        <Image source={{ uri: url, headers }} style={styles.cardImage} contentFit="cover" cachePolicy="memory-disk" />
      ) : (
        <View style={[styles.cardImage, styles.cardImageFallback]} />
      )}
      <View style={styles.cardBody}>
        <TextField
          label="Title"
          value={caption}
          onChangeText={setCaption}
          editable={!disabled}
          placeholder="Name this memory"
          onBlur={() => {
            if (caption === savedRef.current) return;
            savedRef.current = caption;
            onCaptionBlur(caption);
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.lg,
  },
  title: {
    ...typography.titleSmall,
  },
  sub: {
    ...typography.body,
    color: colors.light.textSecondary,
    marginTop: -spacing.md,
  },
  section: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.light.text,
  },
  emptyCard: {
    padding: spacing.md,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surfaceMuted,
  },
  emptyText: {
    ...typography.body,
    color: colors.light.textSecondary,
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.brand.pinkDeep,
  },
  addButtonLabel: {
    ...typography.label,
    fontSize: 13,
    color: colors.brand.pinkDeep,
  },
  dropzone: {
    minHeight: 140,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: colors.light.borderStrong,
    backgroundColor: colors.light.surfaceMuted,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    padding: spacing.md,
  },
  dropzoneText: {
    ...typography.label,
    color: colors.light.text,
  },
  dropzoneHint: {
    ...typography.caption,
    color: colors.light.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  card: {
    width: '47%',
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    backgroundColor: colors.light.surfaceMuted,
  },
  cardIndex: {
    ...typography.caption,
    color: colors.light.textSecondary,
  },
  cardImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.light.surfaceMuted,
  },
  cardImageFallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: spacing.sm,
  },
  pendingCard: {
    width: '47%',
    borderRadius: radii.lg,
    overflow: 'hidden',
    height: 168,
    backgroundColor: colors.light.surfaceMuted,
  },
  pendingImage: {
    ...StyleSheet.absoluteFill,
  },
  pendingOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(28,24,20,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.sm,
  },
  pendingOverlayText: {
    ...typography.caption,
    color: '#fff',
  },
  pendingErrorText: {
    ...typography.caption,
    color: '#fff',
    textAlign: 'center',
  },
  pendingActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  pendingActionButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 6,
    borderRadius: radii.pill,
    backgroundColor: 'rgba(255,255,255,0.9)',
  },
  pendingActionLabel: {
    ...typography.caption,
    fontFamily: 'Manrope_600SemiBold',
    color: colors.light.text,
  },
  limitText: {
    ...typography.caption,
    color: colors.light.textMuted,
  },
});
