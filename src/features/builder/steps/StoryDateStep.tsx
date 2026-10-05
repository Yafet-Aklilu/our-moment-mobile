import { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { useSaveMomentStepMutation } from '@/api/hooks/useMoments';
import { PageIntro } from '@/components/ui/PageIntro';
import { TextField } from '@/components/ui/TextField';
import { BuilderSaveStatus } from '@/features/builder/BuilderSaveStatus';
import { readContentValue } from '@/features/builder/contentHelpers';
import { useAutosaveStatus } from '@/features/builder/useAutosaveStatus';
import type { BuilderStep } from '@/features/builder/types';
import { spacing } from '@/theme';
import type { Moment } from '@/types/api';

type Props = {
  moment: Moment;
  step: Extract<BuilderStep, { kind: 'story' }>;
};

/**
 * Date story step (template `type: 'date'`), e.g. an anniversary or
 * countdown target. Kept as a simple `YYYY-MM-DD` text field — the server
 * only requires `strtotime()`-parseable input.
 */
export function StoryDateStep({ moment, step }: Props) {
  const readOnly = moment.state === 'activated';
  const mutation = useSaveMomentStepMutation(moment.id);
  const { status, errorMessage, run } = useAutosaveStatus(readOnly);

  const initial = readContentValue(moment.content, step.stepId);
  const [value, setValue] = useState(initial);
  const savedValueRef = useRef(initial);

  const onBlur = () => {
    if (readOnly) return;
    const trimmed = value.trim();
    if (trimmed === savedValueRef.current) return;
    void run(async () => {
      await mutation.mutateAsync({
        stepId: step.stepId,
        value: trimmed || null,
        type: 'date',
        is_autosave: true,
      });
      savedValueRef.current = trimmed;
    });
  };

  return (
    <View style={styles.root}>
      <PageIntro
        title={step.label}
        body={step.description || 'A date that matters.'}
        style={styles.intro}
      />

      <TextField
        label="Date"
        value={value}
        onChangeText={setValue}
        onBlur={onBlur}
        editable={!readOnly}
        placeholder="YYYY-MM-DD"
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="numbers-and-punctuation"
        maxLength={10}
      />

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
});
