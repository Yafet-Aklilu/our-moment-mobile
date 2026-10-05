/**
 * Scene resolver smoke checks — run with:
 *   npx tsx src/player/resolveNativeScenes.test.ts
 */
import { asMomentConfig } from './momentConfig';
import { resolveMomentScenes, resolveEffectiveDurationSeconds } from './resolveNativeScenes';

function assert(cond: unknown, msg: string) {
  if (!cond) throw new Error(msg);
}

const loveConfig = asMomentConfig({
  type: 'love',
  theme: { primary: '#FF6C71', text: '#FFF5F0', background: 'linear-gradient(#1A1218, #241423)' },
  content: {
    title: 'For Alex',
    subtitle: 'From Sam',
    message: 'You make ordinary days feel like a celebration.',
    finalMessage: 'Always yours.',
    images: [{ id: '1', url: 'https://example.com/a.jpg' }],
  },
  scenes: [],
  playback: { sceneOrder: [] },
});

assert(loveConfig, 'love config parses');
const scenes = resolveMomentScenes(loveConfig!);
const ids = scenes.map((s) => s.id);
assert(ids[0] === 'preload', 'starts with preload');
assert(ids.includes('title'), 'has title');
assert(ids.includes('messageReveal'), 'has message');
assert(ids.includes('memoryImage'), 'has memory image');
assert(ids.includes('finalMessage'), 'has final message');
assert(ids.includes('cta'), 'ends with cta');
assert(ids[ids.length - 1] === 'cta', 'cta is last');

const messageScene = scenes.find((s) => s.id === 'messageReveal')!;
const duration = resolveEffectiveDurationSeconds(messageScene, {
  ...loveConfig!.content,
  ...messageScene.props,
});
assert(duration >= 6, `auto message duration >= 6 (got ${duration})`);

const withLock = asMomentConfig({
  type: 'celebration',
  theme: {},
  content: {
    title: 'Happy day',
    lock: { type: 'swipe' },
  },
  scenes: [],
  playback: {},
});
const locked = resolveMomentScenes(withLock!);
assert(locked[0]?.id === 'lock', 'lock prepended when content.lock present');
assert(locked[0]?.props.manualAdvance === true, 'lock is manualAdvance');

console.log('resolveNativeScenes checks passed');
