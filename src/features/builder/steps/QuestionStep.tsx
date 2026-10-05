import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useUpdateMomentSettingsMutation } from '@/api/hooks/useMoments';
import { PageIntro } from '@/components/ui/PageIntro';
import { BuilderSaveStatus } from '@/features/builder/BuilderSaveStatus';
import { asSettings } from '@/features/builder/contentHelpers';
import { QUESTION_TYPES } from '@/features/builder/experienceOptions';
import { useAutosaveStatus } from '@/features/builder/useAutosaveStatus';
import { ChoiceChips } from '@/features/builder/ui/ChoiceChips';
import { ToggleRow } from '@/features/builder/ui/ToggleRow';
import { colors, radii, spacing, typography } from '@/theme';
import type { Moment } from '@/types/api';

type Props = {
  moment: Moment;
};

const MAX_TEXT = 500;
const MAX_OPTION = 200;
const MAX_OPTIONS = 4;

/** Experience: Question. Gate mirrors server `validateEnabled` before saving. */
export function QuestionStep({ moment }: Props) {
  const readOnly = moment.state === 'activated';
  const mutation = useUpdateMomentSettingsMutation(moment.id);
  const { status, errorMessage, run } = useAutosaveStatus(readOnly);

  const settings = asSettings(moment);
  const question =
    settings.question && typeof settings.question === 'object'
      ? (settings.question as Record<string, unknown>)
      : {};

  const [enabled, setEnabled] = useState(Boolean(question.enabled));
  const [type, setType] = useState(typeof question.type === 'string' ? question.type : 'continue');
  const [text, setText] = useState(typeof question.text === 'string' ? question.text : '');
  const initialOptions = Array.isArray(question.options)
    ? (question.options as unknown[]).filter((o): o is string => typeof o === 'string')
    : [];
  const [options, setOptions] = useState<string[]>(initialOptions.length ? initialOptions : ['', '']);
  const [correctIndex, setCorrectIndex] = useState(
    typeof question.correctIndex === 'number' ? question.correctIndex : 0,
  );
  const [gateHint, setGateHint] = useState<string | null>(null);

  const persist = (next: {
    enabled: boolean;
    type: string;
    text: string;
    options: string[];
    correctIndex: number;
  }) => {
    const trimmedText = next.text.trim();
    const filledOptions = next.options.map((o) => o.trim()).filter(Boolean);

    if (next.enabled) {
      if (!trimmedText) {
        setGateHint('Add the question text to save.');
        return;
      }
      if (next.type === 'multiple-choice') {
        if (filledOptions.length < 2) {
          setGateHint('Add at least two options to save.');
          return;
        }
        if (next.correctIndex < 0 || next.correctIndex >= filledOptions.length) {
          setGateHint('Choose the correct answer to save.');
          return;
        }
      }
    }
    setGateHint(null);

    void run(async () => {
      await mutation.mutateAsync({
        ...settings,
        question: {
          enabled: next.enabled,
          type: next.type,
          text: trimmedText || undefined,
          options: next.type === 'multiple-choice' ? filledOptions : [],
          correctIndex: next.type === 'multiple-choice' ? next.correctIndex : undefined,
        },
      });
    });
  };

  const onToggle = (next: boolean) => {
    setEnabled(next);
    persist({ enabled: next, type, text, options, correctIndex });
  };

  const onTypeSelect = (next: string) => {
    setType(next);
    const nextOptions = next === 'multiple-choice' && options.length < 2 ? ['', ''] : options;
    setOptions(nextOptions);
    persist({ enabled, type: next, text, options: nextOptions, correctIndex });
  };

  const onTextBlur = () => persist({ enabled, type, text, options, correctIndex });

  const updateOption = (index: number, value: string) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  };

  const onOptionBlur = () => persist({ enabled, type, text, options, correctIndex });

  const addOption = () => {
    if (options.length >= MAX_OPTIONS) return;
    setOptions((prev) => [...prev, '']);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    const next = options.filter((_, i) => i !== index);
    setOptions(next);
    const nextCorrect = correctIndex >= next.length ? 0 : correctIndex;
    setCorrectIndex(nextCorrect);
    persist({ enabled, type, text, options: next, correctIndex: nextCorrect });
  };

  const selectCorrect = (index: number) => {
    setCorrectIndex(index);
    persist({ enabled, type, text, options, correctIndex: index });
  };

  return (
    <View style={styles.root}>
      <PageIntro
        title="Question"
        body="Ask them something first, if you want."
        style={styles.intro}
      />

      <ToggleRow label="Enable question" value={enabled} onChange={onToggle} disabled={readOnly} />

      {enabled ? (
        <View style={styles.section}>
          <Text style={styles.label}>Type</Text>
          <ChoiceChips options={QUESTION_TYPES} value={type} onChange={onTypeSelect} disabled={readOnly} />

          <Text style={styles.label}>Question text</Text>
          <TextInput
            value={text}
            onChangeText={setText}
            onBlur={onTextBlur}
            editable={!readOnly}
            maxLength={MAX_TEXT}
            placeholder="Where did we first meet?"
            placeholderTextColor={colors.light.textMuted}
            style={styles.textInput}
            multiline
          />

          {type === 'multiple-choice' ? (
            <View style={styles.optionsSection}>
              <Text style={styles.label}>Options</Text>
              {options.map((option, index) => (
                <View key={index} style={styles.optionRow}>
                  <Pressable
                    onPress={() => selectCorrect(index)}
                    disabled={readOnly}
                    style={styles.correctToggle}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: correctIndex === index }}
                  >
                    <Ionicons
                      name={correctIndex === index ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={correctIndex === index ? colors.brand.pinkDeep : colors.light.borderStrong}
                    />
                  </Pressable>
                  <TextInput
                    value={option}
                    onChangeText={(value) => updateOption(index, value)}
                    onBlur={onOptionBlur}
                    editable={!readOnly}
                    maxLength={MAX_OPTION}
                    placeholder={`Option ${index + 1}`}
                    placeholderTextColor={colors.light.textMuted}
                    style={styles.optionInput}
                  />
                  {options.length > 2 ? (
                    <Pressable onPress={() => removeOption(index)} disabled={readOnly} hitSlop={8}>
                      <Ionicons name="close" size={18} color={colors.light.textMuted} />
                    </Pressable>
                  ) : null}
                </View>
              ))}
              {options.length < MAX_OPTIONS ? (
                <Pressable onPress={addOption} disabled={readOnly} style={styles.addOption}>
                  <Ionicons name="add" size={16} color={colors.brand.pinkDeep} />
                  <Text style={styles.addOptionLabel}>Add option</Text>
                </Pressable>
              ) : null}
              <Text style={styles.hint}>Tap the circle to mark the correct answer.</Text>
            </View>
          ) : null}

          {gateHint ? <Text style={styles.gateHint}>{gateHint}</Text> : null}
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
    gap: spacing.md,
  },
  label: {
    ...typography.label,
    color: colors.light.text,
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
    minHeight: 88,
    textAlignVertical: 'top',
  },
  optionsSection: {
    gap: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  correctToggle: {
    padding: 2,
  },
  optionInput: {
    ...typography.body,
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.light.border,
    borderRadius: radii.lg,
    backgroundColor: colors.light.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    color: colors.light.text,
  },
  addOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingVertical: spacing.xs,
  },
  addOptionLabel: {
    ...typography.label,
    fontSize: 13,
    color: colors.brand.pinkDeep,
  },
  hint: {
    ...typography.caption,
    fontSize: 12,
    color: colors.light.textMuted,
  },
  gateHint: {
    ...typography.caption,
    color: colors.brand.pinkDeep,
  },
});
