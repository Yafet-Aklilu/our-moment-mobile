import { useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { useSaveMomentStepMutation } from '@/api/hooks/useMoments';
import { BuilderSaveStatus } from '@/features/builder/BuilderSaveStatus';
import { plainTextToHtml, readContentValue, stripHtml } from '@/features/builder/contentHelpers';
import { useAutosaveStatus } from '@/features/builder/useAutosaveStatus';
import type { BuilderStep } from '@/features/builder/types';
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

  const onBlur = () => {
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
      <Text style={styles.title}>{step.label}</Text>
      {step.description ? <Text style={styles.sub}>{step.description}</Text> : null}

      <View style={styles.fieldShell}>
        <TextInput
          value={text}
          onChangeText={setText}
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
  title: {
    ...typography.titleSmall,
  },
  sub: {
    ...typography.body,
    color: colors.light.textSecondary,
    marginTop: -spacing.sm,
  },
  fieldShell: {
    minHeight: 160,
    borderRadius: radii.md,
    borderWidth: 1.5,
    borderColor: colors.light.borderStrong,
    backgroundColor: colors.light.surface,
    padding: spacing.md,
  },
  input: {
    ...typography.body,
    flex: 1,
    color: colors.light.text,
  },
  counter: {
    ...typography.caption,
    color: colors.light.textMuted,
    textAlign: 'right',
    marginTop: -spacing.sm,
  },
});
