import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { buildEditorSteps } from '@/features/builder/buildEditorSteps';
import { BuilderFooter } from '@/features/builder/BuilderFooter';
import { BuilderStepRail } from '@/features/builder/BuilderStepRail';
import { ComingSoonStep } from '@/features/builder/steps/ComingSoonStep';
import { CountdownStep } from '@/features/builder/steps/CountdownStep';
import { DetailsStep } from '@/features/builder/steps/DetailsStep';
import { LockStep } from '@/features/builder/steps/LockStep';
import { LookStep } from '@/features/builder/steps/LookStep';
import { MusicStep } from '@/features/builder/steps/MusicStep';
import { OrderStep } from '@/features/builder/steps/OrderStep';
import { PhotosStep } from '@/features/builder/steps/PhotosStep';
import { QuestionStep } from '@/features/builder/steps/QuestionStep';
import { StoryDateStep } from '@/features/builder/steps/StoryDateStep';
import { StoryMessageStep } from '@/features/builder/steps/StoryMessageStep';
import type { BuilderStep, BuilderStepId } from '@/features/builder/types';
import { colors, motion, spacing, typography } from '@/theme';
import type { Moment } from '@/types/api';

type Props = {
  moment: Moment;
};

/**
 * Native Moment Builder shell — renders Details, every content (story) step,
 * and every experience section against the same `/api/v1/moments` contracts
 * as the web editor. `moment` flows from the parent's `useMomentQuery`, so
 * every mutation's cache update re-renders the active step with fresh data.
 */
export function BuilderShell({ moment }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const steps = useMemo(() => buildEditorSteps(moment), [moment]);
  const [activeId, setActiveId] = useState<BuilderStepId>(steps[0]?.id ?? 'details');

  const activeIndex = Math.max(
    0,
    steps.findIndex((s) => s.id === activeId),
  );
  const activeStep = steps[activeIndex] ?? steps[0];
  const isLast = steps.length > 0 && activeIndex === steps.length - 1;

  const goPrev = () => {
    if (activeIndex <= 0) return;
    setActiveId(steps[activeIndex - 1].id);
  };

  const goNext = () => {
    if (isLast) {
      router.push(`/(app)/moments/${moment.id}/preview`);
      return;
    }
    if (activeIndex >= steps.length - 1) return;
    setActiveId(steps[activeIndex + 1].id);
  };

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.progress}>
            Step {Math.min(activeIndex + 1, steps.length)} of {steps.length}
            {moment.template?.title ? ` · ${moment.template.title}` : ''}
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Preview this Moment"
            hitSlop={8}
            onPress={() => router.push(`/(app)/moments/${moment.id}/preview`)}
          >
            <Text style={styles.previewLink}>Preview</Text>
          </Pressable>
        </View>
        <BuilderStepRail
          steps={steps}
          activeId={activeStep?.id ?? 'details'}
          onSelect={setActiveId}
        />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: spacing.lg },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          key={activeStep?.id ?? 'empty'}
          entering={FadeInRight.duration(motion.duration.fast).springify()}
        >
          {renderStep(moment, activeStep)}
        </Animated.View>
      </ScrollView>

      <View style={{ paddingBottom: Math.max(insets.bottom, spacing.sm) }}>
        <BuilderFooter
          momentId={moment.id}
          canGoPrev={activeIndex > 0}
          canGoNext={activeIndex < steps.length - 1}
          onPrev={goPrev}
          onNext={goNext}
          isLast={isLast}
        />
      </View>
    </View>
  );
}

function renderStep(moment: Moment, activeStep: BuilderStep | undefined) {
  if (!activeStep) {
    return <Text style={styles.empty}>No builder steps for this style yet.</Text>;
  }

  if (activeStep.kind === 'details') {
    return <DetailsStep key={`details-${moment.id}`} moment={moment} />;
  }

  if (activeStep.kind === 'story') {
    if (activeStep.step.type === 'text') {
      return <StoryMessageStep moment={moment} step={activeStep} />;
    }
    if (activeStep.step.type === 'date') {
      return <StoryDateStep moment={moment} step={activeStep} />;
    }
    return <ComingSoonStep step={activeStep} />;
  }

  switch (activeStep.experienceId) {
    case 'background':
      return <LookStep moment={moment} />;
    case 'gallery':
      return <PhotosStep moment={moment} />;
    case 'countdown':
      return <CountdownStep moment={moment} />;
    case 'question':
      return <QuestionStep moment={moment} />;
    case 'lock':
      return <LockStep moment={moment} />;
    case 'sound':
      return <MusicStep moment={moment} />;
    case 'playback':
      return <OrderStep moment={moment} />;
    default:
      return <ComingSoonStep step={activeStep} />;
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  header: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.light.border,
    paddingBottom: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  progress: {
    ...typography.caption,
    color: colors.light.textSecondary,
    flexShrink: 1,
  },
  previewLink: {
    ...typography.label,
    fontSize: 13,
    color: colors.brand.pinkDeep,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  empty: {
    ...typography.body,
    color: colors.light.textSecondary,
  },
});
