/**
 * `lock` scene — native port of `LockScene.vue` + its five style variants
 * (`SwipeUnlockLock`, `IphonePasscodeLock`, `PatternLock`,
 * `HeartSequenceLock`, `MemoryQuestionLock`).
 *
 * This is the owner preview: the full secret (passcode / pattern / sequence
 * / answer) is present locally, so unlocking is verified client-side —
 * there is no `remote`/`verifyUrl` round-trip here (that only exists on the
 * public/recipient config).
 *
 * A lock whose secret is missing or unsatisfiable degrades to `swipe` so
 * playback can never dead-end, mirroring `LockScene.vue`'s
 * `normalizedType`.
 */
import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Animated,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';

import { fontFamilies, radii, spacing, touchMin } from '@/theme';
import { resolveNativeMomentTheme, withAlpha } from '@/player/nativeTheme';
import type { MomentLockContent, MomentLockType } from '@/player/momentConfig';
import type { NativeSceneProps } from '@/player/resolveNativeScenes';

import { GlassOption } from './GlassOption';
import { SceneFrame } from './SceneFrame';

type NormalizedLock = {
  type: MomentLockType;
  passcode: string;
  pattern: number[];
  sequence: number[];
  question: string;
  options: string[];
  correctIndex: number;
  hint: string;
  message: string;
};

function normalizeLock(raw: MomentLockContent): NormalizedLock {
  const pattern = Array.isArray(raw.pattern) ? raw.pattern.map(Number).filter(Number.isInteger) : [];
  const sequence = Array.isArray(raw.sequence) ? raw.sequence.map(Number).filter(Number.isInteger) : [];
  const options = Array.isArray(raw.options) ? raw.options.filter(Boolean) : [];
  const correctIndex = typeof raw.correctIndex === 'number' ? raw.correctIndex : 0;
  const passcode = String(raw.passcode ?? '');

  let type: MomentLockType = raw.type ?? 'swipe';
  switch (type) {
    case 'iphone-passcode':
      if (!/^\d{4,6}$/.test(passcode)) type = 'swipe';
      break;
    case 'pattern':
      if (pattern.length < 2) type = 'swipe';
      break;
    case 'heart-sequence':
      if (sequence.length < 1) type = 'swipe';
      break;
    case 'memory-question':
      if (options.length === 0 || correctIndex < 0 || correctIndex >= options.length) type = 'swipe';
      break;
    default:
      type = 'swipe';
  }

  return {
    type,
    passcode,
    pattern,
    sequence,
    question: raw.question ?? 'Where did we first meet?',
    options,
    correctIndex,
    hint: raw.hint ?? '',
    message: typeof raw.message === 'string' ? raw.message : '',
  };
}

function useShake() {
  const [shakeX] = useState(() => new Animated.Value(0));
  const trigger = () => {
    shakeX.setValue(0);
    Animated.sequence([
      Animated.timing(shakeX, { toValue: -8, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 8, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: -5, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 5, duration: 45, useNativeDriver: true }),
      Animated.timing(shakeX, { toValue: 0, duration: 45, useNativeDriver: true }),
    ]).start();
  };
  return { shakeX, trigger };
}

export function SceneLock({ config, scene, onAdvance }: NativeSceneProps) {
  const { textColor, mutedColor, accentColor } = resolveNativeMomentTheme(config.theme);
  const lock = useMemo(
    () => normalizeLock((scene.props.lockData as MomentLockContent | undefined) ?? config.content.lock ?? {}),
    [scene.props.lockData, config.content.lock],
  );

  return (
    <SceneFrame eyebrow="A little key" textColor={textColor} mutedColor={mutedColor}>
      {lock.message ? (
        <Text style={[styles.message, { color: textColor }]}>{lock.message}</Text>
      ) : null}

      {lock.type === 'iphone-passcode' ? (
        <PasscodeLock lock={lock} textColor={textColor} mutedColor={mutedColor} onUnlock={onAdvance} />
      ) : lock.type === 'pattern' ? (
        <PatternLock lock={lock} textColor={textColor} mutedColor={mutedColor} onUnlock={onAdvance} />
      ) : lock.type === 'heart-sequence' ? (
        <HeartSequenceLock lock={lock} textColor={textColor} accentColor={accentColor} onUnlock={onAdvance} />
      ) : lock.type === 'memory-question' ? (
        <MemoryQuestionLock lock={lock} textColor={textColor} accentColor={accentColor} onUnlock={onAdvance} />
      ) : (
        <SwipeUnlockLock textColor={textColor} accentColor={accentColor} onUnlock={onAdvance} />
      )}

      {lock.hint ? (
        <Text style={[styles.hint, { color: mutedColor }]}>
          <Text style={[styles.hintLabel, { color: mutedColor }]}>Hint{'  '}</Text>
          {lock.hint}
        </Text>
      ) : null}
    </SceneFrame>
  );
}

/** Always succeeds — there is no secret to check for the swipe type. */
function SwipeUnlockLock({
  textColor,
  accentColor,
  onUnlock,
}: {
  textColor: string;
  accentColor: string;
  onUnlock: () => void;
}) {
  const [trackWidth, setTrackWidth] = useState(280);
  const [handleX] = useState(() => new Animated.Value(0));
  const maxX = Math.max(trackWidth - 56, 40);

  // No "already unlocked" guard needed: a completed pan gesture fires
  // `onPanResponderRelease` exactly once, and `NativeMomentPlayer.advance()`
  // already debounces rapid double-advances.
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gesture) => {
          const next = Math.min(Math.max(gesture.dx, 0), maxX);
          handleX.setValue(next);
        },
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dx >= maxX - 12) {
            Animated.timing(handleX, { toValue: maxX, duration: 120, useNativeDriver: false }).start();
            onUnlock();
            return;
          }
          Animated.spring(handleX, { toValue: 0, useNativeDriver: false }).start();
        },
      }),
    [maxX, handleX, onUnlock],
  );

  return (
    <View
      style={[styles.swipeTrack, { borderColor: withAlpha(textColor, 0.28), backgroundColor: withAlpha(textColor, 0.1) }]}
      onLayout={(e: LayoutChangeEvent) => setTrackWidth(e.nativeEvent.layout.width)}
    >
      <Text style={[styles.swipeLabel, { color: withAlpha(textColor, 0.84) }]}>Slide to reveal</Text>
      <Animated.View
        {...panResponder.panHandlers}
        style={[styles.swipeHandle, { backgroundColor: '#fff', transform: [{ translateX: handleX }] }]}
      >
        <Ionicons name="chevron-forward" size={18} color={accentColor} />
      </Animated.View>
    </View>
  );
}

function PasscodeLock({
  lock,
  textColor,
  mutedColor,
  onUnlock,
}: {
  lock: NormalizedLock;
  textColor: string;
  mutedColor: string;
  onUnlock: () => void;
}) {
  const codeLength = Math.max(lock.passcode.length || 6, 1);
  const [entered, setEntered] = useState('');
  const [wrong, setWrong] = useState(false);
  const { shakeX, trigger } = useShake();

  const submit = (typed: string) => {
    if (typed === lock.passcode) {
      setTimeout(onUnlock, 120);
      return;
    }
    setWrong(true);
    trigger();
    setTimeout(() => {
      setEntered('');
      setWrong(false);
    }, 420);
  };

  const press = (digit: string) => {
    if (wrong || entered.length >= codeLength) return;
    const next = entered + digit;
    setEntered(next);
    if (next.length === codeLength) submit(next);
  };

  return (
    <Animated.View style={[styles.center, { transform: [{ translateX: shakeX }] }]}>
      <View style={styles.dotsRow}>
        {Array.from({ length: codeLength }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.passcodeDot,
              { borderColor: withAlpha(textColor, 0.35) },
              i < entered.length ? { backgroundColor: textColor } : null,
            ]}
          />
        ))}
      </View>
      <View style={styles.keypad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
          <Pressable
            key={digit}
            onPress={() => press(digit)}
            style={[styles.key, { borderColor: withAlpha(textColor, 0.16), backgroundColor: withAlpha(textColor, 0.08) }]}
          >
            <Text style={[styles.keyLabel, { color: textColor }]}>{digit}</Text>
          </Pressable>
        ))}
        <Pressable
          onPress={() => setEntered((v) => v.slice(0, -1))}
          style={[styles.key, { borderColor: withAlpha(textColor, 0.16), backgroundColor: withAlpha(textColor, 0.08) }]}
        >
          <Text style={[styles.keyLabelSmall, { color: mutedColor }]}>Delete</Text>
        </Pressable>
        <Pressable
          onPress={() => press('0')}
          style={[styles.key, { borderColor: withAlpha(textColor, 0.16), backgroundColor: withAlpha(textColor, 0.08) }]}
        >
          <Text style={[styles.keyLabel, { color: textColor }]}>0</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const PATTERN_DOTS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

function PatternLock({
  lock,
  textColor,
  mutedColor,
  onUnlock,
}: {
  lock: NormalizedLock;
  textColor: string;
  mutedColor: string;
  onUnlock: () => void;
}) {
  const expectedLength = lock.pattern.length || 3;
  const [tapped, setTapped] = useState<number[]>([]);
  const { shakeX, trigger } = useShake();

  const reset = () => setTapped([]);

  const tapDot = (id: number) => {
    if (tapped.includes(id)) return;
    const next = [...tapped, id];
    setTapped(next);
    if (next.length === expectedLength) {
      const valid = JSON.stringify(next) === JSON.stringify(lock.pattern);
      if (valid) {
        setTimeout(onUnlock, 140);
      } else {
        trigger();
        setTimeout(reset, 420);
      }
    }
  };

  return (
    <Animated.View style={[styles.center, { transform: [{ translateX: shakeX }] }]}>
      <View style={styles.patternGrid}>
        {PATTERN_DOTS.map((id) => (
          <Pressable
            key={id}
            onPress={() => tapDot(id)}
            style={[
              styles.patternDot,
              { borderColor: withAlpha(textColor, 0.24), backgroundColor: withAlpha(textColor, 0.08) },
              tapped.includes(id) ? { backgroundColor: withAlpha(textColor, 0.28) } : null,
            ]}
          >
            <Text style={[styles.patternDotLabel, { color: textColor }]}>
              {tapped.includes(id) ? tapped.indexOf(id) + 1 : ''}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={[styles.patternHelp, { color: mutedColor }]}>Tap the dots in order</Text>
    </Animated.View>
  );
}

const HEARTS = [0, 1, 2, 3, 4];

function HeartSequenceLock({
  lock,
  textColor,
  accentColor,
  onUnlock,
}: {
  lock: NormalizedLock;
  textColor: string;
  accentColor: string;
  onUnlock: () => void;
}) {
  const expectedLength = lock.sequence.length || 1;
  const [tapped, setTapped] = useState<number[]>([]);
  const { shakeX, trigger } = useShake();

  const tapHeart = (index: number) => {
    if (tapped.length >= expectedLength) return;
    const next = [...tapped, index];
    setTapped(next);
    if (next.length === expectedLength) {
      const valid = JSON.stringify(next) === JSON.stringify(lock.sequence);
      if (valid) {
        setTimeout(onUnlock, 160);
      } else {
        trigger();
        setTimeout(() => setTapped([]), 420);
      }
    }
  };

  return (
    <Animated.View style={[styles.center, { transform: [{ translateX: shakeX }] }]}>
      <View style={styles.heartRow}>
        {HEARTS.map((index) => {
          const active = tapped.includes(index);
          return (
            <Pressable
              key={index}
              onPress={() => tapHeart(index)}
              style={[
                styles.heart,
                { borderColor: withAlpha(textColor, 0.28), backgroundColor: withAlpha(textColor, 0.1) },
              ]}
            >
              <Ionicons
                name={active ? 'heart' : 'heart-outline'}
                size={22}
                color={active ? accentColor : textColor}
              />
            </Pressable>
          );
        })}
      </View>
    </Animated.View>
  );
}

function MemoryQuestionLock({
  lock,
  textColor,
  accentColor,
  onUnlock,
}: {
  lock: NormalizedLock;
  textColor: string;
  accentColor: string;
  onUnlock: () => void;
}) {
  const [wrongIndex, setWrongIndex] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  return (
    <View style={styles.center}>
      <Text style={[styles.prompt, { color: textColor }]}>{lock.question}</Text>
      <View style={styles.options}>
        {lock.options.map((option, index) => (
          <GlassOption
            key={`${option}-${index}`}
            label={option}
            textColor={textColor}
            accentColor={accentColor}
            state={wrongIndex === index ? 'wrong' : 'idle'}
            disabled={locked}
            onPress={() => {
              if (locked) return;
              if (index === lock.correctIndex) {
                setLocked(true);
                onUnlock();
                return;
              }
              setWrongIndex(index);
              setTimeout(() => setWrongIndex(null), 380);
            }}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  message: {
    fontFamily: fontFamilies.bodyMedium,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  hint: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginTop: spacing.lg,
    maxWidth: 320,
  },
  hintLabel: {
    fontFamily: fontFamilies.bodySemi,
    fontSize: 11,
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  center: { width: '100%', alignItems: 'center' },
  prompt: {
    fontFamily: fontFamilies.headline,
    fontSize: 24,
    lineHeight: 30,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  options: { width: '100%', gap: spacing.sm },

  swipeTrack: {
    width: '100%',
    minHeight: touchMin + 12,
    borderRadius: radii.xl,
    borderWidth: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  swipeLabel: {
    position: 'absolute',
    left: touchMin + 16,
    right: spacing.md,
    fontFamily: fontFamilies.bodySemi,
    fontSize: 14,
    textAlign: 'center',
  },
  swipeHandle: {
    position: 'absolute',
    left: 6,
    top: 6,
    width: touchMin,
    height: touchMin,
    borderRadius: touchMin / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  dotsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl },
  passcodeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  keypad: {
    width: '100%',
    maxWidth: 320,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: spacing.sm,
  },
  key: {
    width: '30%',
    minHeight: 64,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyLabel: { fontFamily: fontFamilies.bodySemi, fontSize: 20 },
  keyLabelSmall: { fontFamily: fontFamilies.bodyMedium, fontSize: 13 },

  patternGrid: {
    width: 260,
    height: 260,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  patternDot: {
    width: '28%',
    height: '28%',
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternDotLabel: { fontFamily: fontFamilies.bodySemi, fontSize: 14 },
  patternHelp: {
    fontFamily: fontFamilies.body,
    fontSize: 13,
    marginTop: spacing.lg,
  },

  heartRow: { flexDirection: 'row', gap: spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  heart: {
    width: 52,
    height: 52,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
