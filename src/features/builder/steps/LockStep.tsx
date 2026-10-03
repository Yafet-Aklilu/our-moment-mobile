import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useUpdateMomentSettingsMutation } from '@/api/hooks/useMoments';
import { BuilderSaveStatus } from '@/features/builder/BuilderSaveStatus';
import { asSettings } from '@/features/builder/contentHelpers';
import { LOCK_TYPES } from '@/features/builder/experienceOptions';
import { useAutosaveStatus } from '@/features/builder/useAutosaveStatus';
import { ChoiceChips } from '@/features/builder/ui/ChoiceChips';
import { ToggleRow } from '@/features/builder/ui/ToggleRow';
import { colors, radii, spacing, typography } from '@/theme';
import type { Moment } from '@/types/api';

type Props = {
  moment: Moment;
};

type LockState = {
  enabled: boolean;
  type: string;
  passcode: string;
  pattern: number[];
  sequence: number[];
  question: string;
  options: string[];
  correctIndex: number;
  message: string;
};

const HEART_BUTTON_COUNT = 5;

function readLockState(settings: Record<string, unknown>): LockState {
  const lock = settings.lock && typeof settings.lock === 'object' ? (settings.lock as Record<string, unknown>) : {};
  const options = Array.isArray(lock.options)
    ? (lock.options as unknown[]).filter((o): o is string => typeof o === 'string')
    : [];
  return {
    enabled: Boolean(lock.enabled),
    type: typeof lock.type === 'string' ? lock.type : 'swipe',
    passcode: typeof lock.passcode === 'string' ? lock.passcode : '',
    pattern: Array.isArray(lock.pattern) ? (lock.pattern as unknown[]).filter((n): n is number => typeof n === 'number') : [],
    sequence: Array.isArray(lock.sequence)
      ? (lock.sequence as unknown[]).filter((n): n is number => typeof n === 'number')
      : [],
    question: typeof lock.question === 'string' ? lock.question : '',
    options: options.length ? options : ['', ''],
    correctIndex: typeof lock.correctIndex === 'number' ? lock.correctIndex : 0,
    message: typeof lock.message === 'string' ? lock.message : '',
  };
}

/** Experience: Lock. Gate mirrors server `validateEnabled` per lock type before saving. */
export function LockStep({ moment }: Props) {
  const readOnly = moment.state === 'activated';
  const mutation = useUpdateMomentSettingsMutation(moment.id);
  const { status, errorMessage, run } = useAutosaveStatus(readOnly);

  const settings = asSettings(moment);
  const initial = readLockState(settings);

  const [state, setState] = useState<LockState>(initial);
  const [gateHint, setGateHint] = useState<string | null>(null);

  const persist = (next: LockState) => {
    const filledOptions = next.options.map((o) => o.trim()).filter(Boolean);

    if (next.enabled) {
      if (!next.type) {
        setGateHint('Choose a lock type to save.');
        return;
      }
      if (next.type === 'iphone-passcode' && !/^\d{4,}$/.test(next.passcode.trim())) {
        setGateHint('Passcode must be at least 4 digits.');
        return;
      }
      if (next.type === 'pattern' && next.pattern.length < 3) {
        setGateHint('Draw a pattern with at least 3 points.');
        return;
      }
      if (next.type === 'heart-sequence' && next.sequence.length < 2) {
        setGateHint('Tap at least 2 hearts in sequence.');
        return;
      }
      if (next.type === 'memory-question') {
        if (!next.question.trim()) {
          setGateHint('Add the memory question to save.');
          return;
        }
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
        lock: {
          enabled: next.enabled,
          type: next.type,
          passcode: next.type === 'iphone-passcode' ? next.passcode.trim() : undefined,
          pattern: next.type === 'pattern' ? next.pattern : [],
          sequence: next.type === 'heart-sequence' ? next.sequence : [],
          question: next.type === 'memory-question' ? next.question.trim() : undefined,
          options: next.type === 'memory-question' ? filledOptions : [],
          correctIndex: next.type === 'memory-question' ? next.correctIndex : undefined,
          message: next.message.trim() || undefined,
        },
      });
    });
  };

  const update = (patch: Partial<LockState>, save: boolean) => {
    const next = { ...state, ...patch };
    setState(next);
    if (save) persist(next);
  };

  const onToggle = (next: boolean) => update({ enabled: next }, true);
  const onTypeSelect = (next: string) => update({ type: next }, true);
  const onPasscodeBlur = () => persist(state);
  const onMessageBlur = () => persist(state);

  const togglePatternCell = (index: number) => {
    const existingAt = state.pattern.indexOf(index);
    const nextPattern = existingAt === -1 ? [...state.pattern, index] : state.pattern.slice(0, existingAt);
    update({ pattern: nextPattern }, true);
  };

  const clearPattern = () => update({ pattern: [] }, true);

  const tapHeart = (value: number) => {
    update({ sequence: [...state.sequence, value] }, true);
  };

  const clearSequence = () => update({ sequence: [] }, true);

  const updateOption = (index: number, value: string) => {
    setState((prev) => ({ ...prev, options: prev.options.map((o, i) => (i === index ? value : o)) }));
  };

  const onOptionBlur = () => persist(state);

  const addOption = () => {
    if (state.options.length >= 4) return;
    setState((prev) => ({ ...prev, options: [...prev.options, ''] }));
  };

  const removeOption = (index: number) => {
    if (state.options.length <= 2) return;
    const next = state.options.filter((_, i) => i !== index);
    const nextCorrect = state.correctIndex >= next.length ? 0 : state.correctIndex;
    update({ options: next, correctIndex: nextCorrect }, true);
  };

  const selectCorrect = (index: number) => update({ correctIndex: index }, true);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Lock</Text>
      <Text style={styles.sub}>A passcode, a pattern, or a question only they know.</Text>

      <ToggleRow label="Enable lock" value={state.enabled} onChange={onToggle} disabled={readOnly} />

      {state.enabled ? (
        <View style={styles.section}>
          <Text style={styles.label}>Type</Text>
          <ChoiceChips options={LOCK_TYPES} value={state.type} onChange={onTypeSelect} disabled={readOnly} />

          {state.type === 'iphone-passcode' ? (
            <View>
              <Text style={styles.label}>Passcode</Text>
              <TextInput
                value={state.passcode}
                onChangeText={(v) => setState((prev) => ({ ...prev, passcode: v.replace(/[^0-9]/g, '') }))}
                onBlur={onPasscodeBlur}
                editable={!readOnly}
                keyboardType="number-pad"
                secureTextEntry
                maxLength={12}
                placeholder="At least 4 digits"
                placeholderTextColor={colors.light.textMuted}
                style={styles.textInput}
              />
            </View>
          ) : null}

          {state.type === 'pattern' ? (
            <View style={styles.patternSection}>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Pattern</Text>
                <Pressable onPress={clearPattern} disabled={readOnly}>
                  <Text style={styles.clearLabel}>Clear</Text>
                </Pressable>
              </View>
              <View style={styles.patternGrid}>
                {Array.from({ length: 9 }).map((_, index) => {
                  const order = state.pattern.indexOf(index);
                  const active = order !== -1;
                  return (
                    <Pressable
                      key={index}
                      onPress={() => togglePatternCell(index)}
                      disabled={readOnly}
                      style={[styles.patternCell, active && styles.patternCellActive]}
                    >
                      {active ? <Text style={styles.patternCellText}>{order + 1}</Text> : null}
                    </Pressable>
                  );
                })}
              </View>
              <Text style={styles.hint}>Tap at least 3 points, in order.</Text>
            </View>
          ) : null}

          {state.type === 'heart-sequence' ? (
            <View style={styles.section}>
              <View style={styles.rowBetween}>
                <Text style={styles.label}>Heart sequence</Text>
                <Pressable onPress={clearSequence} disabled={readOnly}>
                  <Text style={styles.clearLabel}>Clear</Text>
                </Pressable>
              </View>
              <View style={styles.heartRow}>
                {Array.from({ length: HEART_BUTTON_COUNT }).map((_, index) => (
                  <Pressable
                    key={index}
                    onPress={() => tapHeart(index)}
                    disabled={readOnly}
                    style={styles.heartButton}
                  >
                    <Ionicons name="heart" size={22} color={colors.brand.pink} />
                    <Text style={styles.heartLabel}>{index + 1}</Text>
                  </Pressable>
                ))}
              </View>
              <Text style={styles.hint}>
                {state.sequence.length ? `Sequence: ${state.sequence.map((n) => n + 1).join(' → ')}` : 'Tap hearts in order (at least 2).'}
              </Text>
            </View>
          ) : null}

          {state.type === 'memory-question' ? (
            <View style={styles.optionsSection}>
              <Text style={styles.label}>Question</Text>
              <TextInput
                value={state.question}
                onChangeText={(v) => setState((prev) => ({ ...prev, question: v }))}
                onBlur={onOptionBlur}
                editable={!readOnly}
                maxLength={500}
                placeholder="Where did we first meet?"
                placeholderTextColor={colors.light.textMuted}
                style={styles.textInput}
                multiline
              />
              <Text style={styles.label}>Options</Text>
              {state.options.map((option, index) => (
                <View key={index} style={styles.optionRow}>
                  <Pressable
                    onPress={() => selectCorrect(index)}
                    disabled={readOnly}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: state.correctIndex === index }}
                  >
                    <Ionicons
                      name={state.correctIndex === index ? 'checkmark-circle' : 'ellipse-outline'}
                      size={22}
                      color={state.correctIndex === index ? colors.brand.pinkDeep : colors.light.borderStrong}
                    />
                  </Pressable>
                  <TextInput
                    value={option}
                    onChangeText={(v) => updateOption(index, v)}
                    onBlur={onOptionBlur}
                    editable={!readOnly}
                    maxLength={200}
                    placeholder={`Option ${index + 1}`}
                    placeholderTextColor={colors.light.textMuted}
                    style={styles.optionInput}
                  />
                  {state.options.length > 2 ? (
                    <Pressable onPress={() => removeOption(index)} disabled={readOnly} hitSlop={8}>
                      <Ionicons name="close" size={18} color={colors.light.textMuted} />
                    </Pressable>
                  ) : null}
                </View>
              ))}
              {state.options.length < 4 ? (
                <Pressable onPress={addOption} disabled={readOnly} style={styles.addOption}>
                  <Ionicons name="add" size={16} color={colors.brand.pinkDeep} />
                  <Text style={styles.addOptionLabel}>Add option</Text>
                </Pressable>
              ) : null}
            </View>
          ) : null}

          <Text style={styles.label}>Message on lock (optional)</Text>
          <TextInput
            value={state.message}
            onChangeText={(v) => setState((prev) => ({ ...prev, message: v }))}
            onBlur={onMessageBlur}
            editable={!readOnly}
            maxLength={500}
            placeholder="e.g. What is my phone unlock pattern?"
            placeholderTextColor={colors.light.textMuted}
            style={styles.textInput}
            multiline
          />

          {gateHint ? <Text style={styles.gateHint}>{gateHint}</Text> : null}
        </View>
      ) : null}

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
  section: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.light.text,
    marginTop: spacing.xs,
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
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  clearLabel: {
    ...typography.caption,
    color: colors.brand.pinkDeep,
    fontFamily: 'Manrope_600SemiBold',
  },
  patternSection: {
    gap: spacing.xs,
  },
  patternGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 3 * 56,
    gap: 8,
  },
  patternCell: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.light.borderStrong,
    backgroundColor: colors.light.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternCellActive: {
    backgroundColor: colors.brand.pink,
    borderColor: colors.brand.pink,
  },
  patternCellText: {
    ...typography.label,
    color: '#fff',
  },
  heartRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  heartButton: {
    alignItems: 'center',
    gap: 2,
    padding: spacing.xs,
  },
  heartLabel: {
    ...typography.caption,
    color: colors.light.textSecondary,
  },
  optionsSection: {
    gap: spacing.sm,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  optionInput: {
    ...typography.body,
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.light.borderStrong,
    borderRadius: radii.md,
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
    color: colors.light.textMuted,
  },
  gateHint: {
    ...typography.caption,
    color: colors.brand.pinkDeep,
  },
});
