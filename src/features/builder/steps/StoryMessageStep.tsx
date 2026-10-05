import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useSaveMomentStepMutation } from '@/api/hooks/useMoments';
import { PageIntro } from '@/components/ui/PageIntro';
import { BuilderSaveStatus } from '@/features/builder/BuilderSaveStatus';
import { plainTextToHtml, readContentValue, stripHtml } from '@/features/builder/contentHelpers';
import type { BuilderStep } from '@/features/builder/types';
import { useAutosaveStatus } from '@/features/builder/useAutosaveStatus';
import { colors, radii, spacing, typography } from '@/theme';
import type { Moment } from '@/types/api';

type Props = {
  moment: Moment;
  step: Extract<BuilderStep, { kind: 'story' }>;
};

const DEFAULT_MAX_LENGTH = 1000;

/**
 * Free-text story step (template `type: 'text'`), e.g. the main message.
 * Content is stored as simple HTML paragraphs (`saveStep` PUT), but the
 * editing UX here is plain text — mirrors what the web RichTextEditor
 * produces for basic line breaks.
 */
export function StoryMessageStep({ moment, step }: Props) {
  const readOnly = moment.state === 'activated';
  const maxLength = step.step.max_length && step.step.max_length > 0 ? step.step.max_length : DEFAULT_MAX_LENGTH;
  const mutation = useSaveMomentStepMutation(moment.id);
  const { status, errorMessage, run } = useAutosaveStatus(readOnly);

  const initial = stripHtml(readContentValue(moment.content, step.stepId));
  const [text, setText] = useState(initial);
  const savedValueRef = useRef(initial);
  const [focused, setFocused] = useState(false);

  const onBlur = () => {
    setFocused(false);
    if (readOnly) return;
    const trimmed = text;
    if (trimmed === savedValueRef.current) return;
    void run(async () => {
      await mutation.mutateAsync({
        stepId: step.stepId,
        value: plainTextToHtml(trimmed),
        type: 'text',
        is_autosave: true,
      });
      savedValueRef.current = trimmed;
    });
  };

  return (
    <View style={styles.root}>
      <PageIntro
        title={step.label}
        body={step.description || 'Write it in your own words.'}
        style={styles.intro}
      />

      <View style={[styles.fieldShell, focused && styles.fieldFocused]}>
        <TextInput
          value={text}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={onBlur}
          editable={!readOnly}
          multiline
          maxLength={maxLength}
          placeholder="Write it in your own words…"
          placeholderTextColor={colors.light.textMuted}
          style={styles.input}
          textAlignVertical="top"
        />
      </View>

      <Text style={styles.counter}>
        {text.length}/{maxLength}
      </Text>

      <BuilderSaveStatus status={status} errorMessage={errorMessage} readOnly={readOnly} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    gap: spacing.md,
  },
  intro: {
    marginBottom: 0,
  },
  fieldShell: {
    minHeight: 180,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    backgroundColor: colors.light.surface,
    padding: spacing.md,
  },
  fieldFocused: {
    borderColor: colors.brand.pink,
    backgroundColor: colors.light.surfaceWarm,
  },
  input: {
    ...typography.body,
    flex: 1,
    minHeight: 148,
    color: colors.light.text,
  },
  counter: {
    ...typography.caption,
    fontSize: 12,
    color: colors.light.textMuted,
    textAlign: 'right',
    marginTop: -spacing.xs,
  },
});
