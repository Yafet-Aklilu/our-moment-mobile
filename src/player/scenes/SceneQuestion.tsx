import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { fontFamilies, spacing } from '@/theme';
import { resolveNativeMomentTheme } from '@/player/nativeTheme';
import type { MomentQuestionContent } from '@/player/momentConfig';
import type { NativeSceneProps } from '@/player/resolveNativeScenes';
import { stripHtml } from '@/player/stripHtml';

import { GlassOption } from './GlassOption';
import { SceneFrame } from './SceneFrame';

/**
 * `question` scene — native port of `QuestionScene.vue` + its
 * continue/yes-no/multiple-choice variants. This is the owner preview, so
 * `correctIndex` is present locally (no remote verification round-trip).
 */
export function SceneQuestion({ config, scene, onAdvance }: NativeSceneProps) {
  const { textColor, mutedColor, accentColor } = resolveNativeMomentTheme(config.theme);
  const raw = (scene.props.question as MomentQuestionContent | undefined) ?? {};

  const options = Array.isArray(raw.options) ? raw.options.filter(Boolean) : [];
  const rawType = raw.type ?? 'continue';
  const type = rawType === 'multiple-choice' && options.length === 0 ? 'continue' : rawType;
  const text = stripHtml(raw.text ?? 'Are you ready?');
  const strict = typeof raw.strict === 'boolean' ? raw.strict : type === 'multiple-choice';
  const correctIndex = typeof raw.correctIndex === 'number' ? raw.correctIndex : 0;

  const [selected, setSelected] = useState<number | null>(null);
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const finish = (delayMs: number) => {
    setLocked(true);
    setTimeout(onAdvance, delayMs);
  };

  if (type === 'yes-no') {
    const yesLabel = raw.yesLabel ?? options[0] ?? 'Yes';
    const noLabel = raw.noLabel ?? options[1] ?? 'Always';
    return (
      <SceneFrame eyebrow="A question for you" textColor={textColor} mutedColor={mutedColor}>
        <Text style={[styles.prompt, { color: textColor }]}>{text}</Text>
        <View style={styles.row}>
          <GlassOption
            label={yesLabel}
            textColor={textColor}
            accentColor={accentColor}
            style={styles.rowItem}
            disabled={locked}
            state={selected === 0 ? 'selected' : 'idle'}
            onPress={() => {
              if (locked) return;
              setSelected(0);
              finish(180);
            }}
          />
          <GlassOption
            label={noLabel}
            textColor={textColor}
            accentColor={accentColor}
            style={styles.rowItem}
            disabled={locked}
            state={selected === 1 ? 'selected' : 'idle'}
            onPress={() => {
              if (locked) return;
              setSelected(1);
              finish(180);
            }}
          />
        </View>
      </SceneFrame>
    );
  }

  if (type === 'multiple-choice') {
    return (
      <SceneFrame eyebrow="A question for you" textColor={textColor} mutedColor={mutedColor}>
        <Text style={[styles.prompt, { color: textColor }]}>{text}</Text>
        <View style={styles.options}>
          {options.map((option, index) => (
            <GlassOption
              key={`${option}-${index}`}
              label={option}
              badge={String.fromCharCode(65 + index)}
              textColor={textColor}
              accentColor={accentColor}
              disabled={locked}
              state={
                wrongIndex === index
                  ? 'wrong'
                  : selected === index
                    ? strict
                      ? 'success'
                      : 'selected'
                    : 'idle'
              }
              onPress={() => {
                if (locked) return;
                setSelected(index);
                const correct = index === correctIndex;

                if (!strict) {
                  finish(220);
                  return;
                }
                if (correct) {
                  finish(320);
                  return;
                }
                setWrongIndex(index);
                setTimeout(() => {
                  setWrongIndex(null);
                  setSelected(null);
                }, 420);
              }}
            />
          ))}
        </View>
      </SceneFrame>
    );
  }

  const continueLabel = raw.continueLabel ?? raw.buttonLabel ?? 'Continue';
  return (
    <SceneFrame eyebrow="A question for you" textColor={textColor} mutedColor={mutedColor}>
      <Text style={[styles.prompt, { color: textColor }]}>{text}</Text>
      <Button label={continueLabel} onPress={() => !locked && finish(0)} />
    </SceneFrame>
  );
}

const styles = StyleSheet.create({
  prompt: {
    fontFamily: fontFamilies.headline,
    fontSize: 26,
    lineHeight: 33,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  rowItem: { flex: 1 },
  options: {
    width: '100%',
    gap: spacing.sm,
  },
});
