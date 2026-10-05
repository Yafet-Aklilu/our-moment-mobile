import { StyleSheet, Text, View } from 'react-native';

import { useUpdateMomentSettingsMutation } from '@/api/hooks/useMoments';
import { PageIntro } from '@/components/ui/PageIntro';
import { BuilderSaveStatus } from '@/features/builder/BuilderSaveStatus';
import { asSettings } from '@/features/builder/contentHelpers';
import { BACKGROUND_STYLES, MOODS } from '@/features/builder/experienceOptions';
import { useAutosaveStatus } from '@/features/builder/useAutosaveStatus';
import { ChoiceChips } from '@/features/builder/ui/ChoiceChips';
import { colors, spacing, typography } from '@/theme';
import type { Moment } from '@/types/api';

type Props = {
  moment: Moment;
};

/** Experience: Look (mood + background style). Always "complete" — saves immediately on selection. */
export function LookStep({ moment }: Props) {
  const readOnly = moment.state === 'activated';
  const mutation = useUpdateMomentSettingsMutation(moment.id);
  const { status, errorMessage, run } = useAutosaveStatus(readOnly);

  const settings = asSettings(moment);
  const mood = typeof settings.mood === 'string' ? settings.mood : null;
  const background =
    settings.background && typeof settings.background === 'object'
      ? (settings.background as Record<string, unknown>)
      : {};
  const backgroundStyle = typeof background.style === 'string' ? background.style : null;

  const onMoodChange = (next: string) => {
    void run(async () => {
      await mutation.mutateAsync({ ...settings, mood: next });
    });
  };

  const onBackgroundChange = (next: string) => {
    void run(async () => {
      await mutation.mutateAsync({ ...settings, background: { ...background, style: next } });
    });
  };

  return (
    <View style={styles.root}>
      <PageIntro
        title="Look"
        body="Choose a mood, then refine the atmosphere."
        style={styles.intro}
      />

      <View style={styles.section}>
        <Text style={styles.label}>Mood</Text>
        <ChoiceChips options={MOODS} value={mood} onChange={onMoodChange} disabled={readOnly} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Background style</Text>
        <ChoiceChips
          options={BACKGROUND_STYLES}
          value={backgroundStyle}
          onChange={onBackgroundChange}
          disabled={readOnly}
        />
      </View>

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
  label: {
    ...typography.label,
    color: colors.light.text,
  },
});
