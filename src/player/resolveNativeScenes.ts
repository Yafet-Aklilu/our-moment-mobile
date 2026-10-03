/**
 * Native port of the web scene resolver + moment-type presets:
 *   our-moment-web/resources/js/utils/resolveMomentScenes.js
 *   our-moment-web/resources/js/moment-types/{celebration,love,apology,memorial}.js
 *
 * Given a `MomentConfig`, produces the ordered, playable list of scenes.
 * Keep this logic in lockstep with the web version — it is the contract
 * that makes server-authored `scenes` overrides behave identically on both
 * platforms.
 */
import { stripHtml } from './stripHtml';
import type { MomentConfig, MomentImage, MomentSceneOverride } from './momentConfig';

export type ResolvedScene = {
  id: string;
  duration?: number | 'auto';
  props: Record<string, unknown>;
};

/**
 * Props every scene component receives. `scene.props` is already merged
 * with `config.content` by `NativeMomentPlayer` (scene props win), mirroring
 * `SceneRenderer.vue`'s `sceneConfigWithContent`.
 */
export type NativeSceneProps = {
  config: MomentConfig;
  scene: ResolvedScene;
  onAdvance: () => void;
  /** Only meaningful for the `cta` scene — restarts the whole playback. */
  onRestart?: () => void;
};

/** Known player scene ids. Unknown ids are dropped instead of dead-ending playback. */
export const KNOWN_SCENE_IDS = new Set([
  'lock',
  'preload',
  'title',
  'gallery',
  'countdown',
  'question',
  'messageReveal',
  'memoryImage',
  'finalMessage',
  'cta',
  'quote',
]);

export const DEFAULT_DURATIONS: Record<string, number | 'auto'> = {
  lock: 8,
  preload: 2.5,
  title: 6,
  gallery: 10,
  countdown: 10,
  question: 'auto', // advances via manualAdvance, not a fixed timer
  messageReveal: 8,
  memoryImage: 8,
  finalMessage: 8,
  cta: 6,
  quote: 8,
};

/** Minimum fallback when an "auto" scene has no computable content. */
export const DEFAULT_AUTO_DURATION_SECONDS = 8;

type PresetScene = { id: string; duration?: number | 'auto'; props?: Record<string, unknown> };

const celebrationPreset: PresetScene[] = [
  { id: 'preload', duration: 2.5 },
  { id: 'title' },
  { id: 'countdown' },
  { id: 'messageReveal', duration: 'auto' },
  { id: 'memoryImage', duration: 8 },
  { id: 'finalMessage', duration: 'auto' },
  { id: 'cta' },
];

const lovePreset: PresetScene[] = [
  { id: 'preload', duration: 2.5 },
  { id: 'title' },
  { id: 'messageReveal', duration: 'auto' },
  { id: 'memoryImage', duration: 8 },
  { id: 'finalMessage', duration: 'auto' },
  { id: 'cta' },
];

const apologyPreset: PresetScene[] = [
  { id: 'preload', duration: 2.5 },
  { id: 'title' },
  { id: 'messageReveal', duration: 'auto' },
  { id: 'memoryImage', duration: 8 },
  { id: 'finalMessage', duration: 'auto' },
  { id: 'cta' },
];

const memorialPreset: PresetScene[] = [
  { id: 'preload', duration: 2.5 },
  { id: 'title' },
  { id: 'quote', duration: 'auto' },
  { id: 'memoryImage', duration: 8 },
  { id: 'memoryImage', duration: 8, props: { imageIndex: 1 } },
  { id: 'finalMessage', duration: 'auto' },
  { id: 'cta' },
];

const momentTypePresets: Record<string, PresetScene[]> = {
  celebration: celebrationPreset,
  love: lovePreset,
  apology: apologyPreset,
  memorial: memorialPreset,
};

function buildSceneOrderKey(id: string, occurrence: number): string {
  return `${id}:${occurrence}`;
}

function normalizeSceneOrder(
  order: MomentConfig['playback']['sceneOrder'],
): { id: string; occurrence: number }[] {
  if (!Array.isArray(order)) return [];
  return order
    .map((entry) => ({
      id: typeof entry?.id === 'string' ? entry.id : '',
      occurrence:
        Number.isInteger(entry?.occurrence) && (entry?.occurrence ?? -1) >= 0
          ? (entry.occurrence as number)
          : 0,
    }))
    .filter((entry) => entry.id);
}

function decorateScenesWithOccurrence(
  list: ResolvedScene[],
): (ResolvedScene & { _occurrence: number })[] {
  const counts: Record<string, number> = {};
  return list.map((scene) => {
    const occurrence = counts[scene.id] ?? 0;
    counts[scene.id] = occurrence + 1;
    return { ...scene, _occurrence: occurrence };
  });
}

function applyPlaybackSceneOrder(
  list: ResolvedScene[],
  sceneOrder: MomentConfig['playback']['sceneOrder'],
): ResolvedScene[] {
  const normalizedOrder = normalizeSceneOrder(sceneOrder);
  if (!normalizedOrder.length) return list;

  const decoratedScenes = decorateScenesWithOccurrence(list);
  const sceneByKey = new Map(
    decoratedScenes.map((scene) => [buildSceneOrderKey(scene.id, scene._occurrence), scene]),
  );
  const usedKeys = new Set<string>();
  const reordered: (ResolvedScene & { _occurrence: number })[] = [];

  normalizedOrder.forEach((entry) => {
    const key = buildSceneOrderKey(entry.id, entry.occurrence);
    const scene = sceneByKey.get(key);
    if (!scene || usedKeys.has(key)) return;
    reordered.push(scene);
    usedKeys.add(key);
  });

  decoratedScenes.forEach((scene) => {
    const key = buildSceneOrderKey(scene.id, scene._occurrence);
    if (usedKeys.has(key)) return;
    reordered.push(scene);
  });

  return reordered.map(({ _occurrence: _drop, ...scene }) => scene);
}

/**
 * Resolve preset + moment overrides into an ordered, playable scene list.
 * Preserves duplicate scene ids (e.g. two `memoryImage` in memorial).
 */
export function resolveMomentScenes(config: MomentConfig | null | undefined): ResolvedScene[] {
  if (!config || typeof config.type !== 'string') return [];

  const preset = momentTypePresets[config.type] ?? [];
  const overrides: MomentSceneOverride[] = Array.isArray(config.scenes) ? config.scenes : [];

  let list: ResolvedScene[] = preset.map((s) => ({
    id: s.id,
    duration: s.duration ?? DEFAULT_DURATIONS[s.id],
    props: s.props ? { ...s.props } : {},
  }));

  const contentLock = config.content?.lock;
  if (contentLock?.type) {
    list.unshift({
      id: 'lock',
      duration: DEFAULT_DURATIONS.lock,
      props: {
        type: contentLock.type,
        lockData: { ...contentLock },
        manualAdvance: true,
      },
    });
  }

  const skipIds = new Set(overrides.filter((o) => o.skip).map((o) => o.id));
  list = list.filter((s) => !skipIds.has(s.id));

  const overridesByIdIndex: Record<string, number> = {};
  const matchedOverrideIndexes = new Set<number>();

  overrides.forEach((o, overrideIndex) => {
    if (o.skip) return;
    const idx = overridesByIdIndex[o.id] ?? 0;
    const sceneIndex = list.findIndex(
      (s, i) => s.id === o.id && list.slice(0, i).filter((x) => x.id === o.id).length === idx,
    );
    if (sceneIndex !== -1) {
      const scene = list[sceneIndex];
      if (o.duration != null) scene.duration = o.duration;
      if (o.props && typeof o.props === 'object') scene.props = { ...scene.props, ...o.props };
      overridesByIdIndex[o.id] = idx + 1;
      matchedOverrideIndexes.add(overrideIndex);
    }
  });

  overrides.forEach((o, overrideIndex) => {
    if (o.skip || matchedOverrideIndexes.has(overrideIndex)) return;

    const newScene: ResolvedScene = {
      id: o.id,
      duration: o.duration ?? DEFAULT_DURATIONS[o.id],
      props: o.props && typeof o.props === 'object' ? { ...o.props } : {},
    };

    if (typeof o.order === 'number') {
      const insertAt = Math.max(0, Math.min(list.length, Math.floor(o.order)));
      list.splice(insertAt, 0, newScene);
    } else {
      list.push(newScene);
    }
  });

  // Drop scenes with ids the renderer cannot resolve.
  list = list.filter((s) => KNOWN_SCENE_IDS.has(s.id));

  return applyPlaybackSceneOrder(list, config.playback?.sceneOrder);
}

/**
 * Estimate reading time in seconds from word count.
 * Formula: wordCount / 2.2 words per second, minimum 6 seconds.
 * Mirrors `our-moment-web/resources/js/utils/readingTime.js`.
 */
export function readingTimeSeconds(text: string | null | undefined): number {
  if (!text || typeof text !== 'string') return 6;
  const trimmed = text.trim();
  if (!trimmed) return 6;
  const wordCount = trimmed.split(/\s+/).filter(Boolean).length;
  const seconds = Math.ceil(wordCount / 2.2);
  return Math.max(6, seconds);
}

const DEFAULT_IMAGE_DURATION_SECONDS = 4;
const MIN_TEXT_IMAGE_DURATION_SECONDS = 7;
const MAX_IMAGE_DURATION_SECONDS = 12;
const MIN_GALLERY_DURATION_SECONDS = 8;
const MAX_GALLERY_DURATION_SECONDS = 180;

function getImageText(image: MomentImage): string {
  return [image?.caption, image?.detail]
    .map((value) => (typeof value === 'string' ? value.trim() : ''))
    .filter(Boolean)
    .join(' ');
}

/** Mirrors `our-moment-web/resources/js/utils/galleryTiming.js`. */
export function getGalleryImageDurationSeconds(image: MomentImage): number {
  const text = getImageText(image);
  if (!text) return DEFAULT_IMAGE_DURATION_SECONDS;
  const readingSeconds = readingTimeSeconds(text);
  return Math.max(
    MIN_TEXT_IMAGE_DURATION_SECONDS,
    Math.min(MAX_IMAGE_DURATION_SECONDS, readingSeconds + 1),
  );
}

export function getGallerySceneDurationSeconds(images: MomentImage[] | null | undefined): number {
  const totalSeconds = (images ?? []).reduce(
    (sum, image) => sum + getGalleryImageDurationSeconds(image),
    0,
  );
  if (!totalSeconds) return MIN_GALLERY_DURATION_SECONDS;
  return Math.max(MIN_GALLERY_DURATION_SECONDS, Math.min(MAX_GALLERY_DURATION_SECONDS, totalSeconds));
}

const DATE_COUNTDOWN_MAX_SECONDS = 120;
const DATE_COUNTDOWN_MIN_SECONDS = 5;
const INVALID_TARGET_ADVANCE_SECONDS = 2.5;

/**
 * Resolve the numeric duration (seconds) the player's auto-advance timer
 * should use for a scene, given its merged props (scene props + moment
 * content). Mirrors the various `duration-change` overrides scattered
 * across the web scene components (`SceneMessageReveal`, `SceneQuote`,
 * `SceneFinalMessage`, `SceneGallery`, `SceneCountdown`).
 */
export function resolveEffectiveDurationSeconds(
  scene: ResolvedScene,
  mergedProps: Record<string, unknown>,
): number {
  // Date-based countdown fallback (no explicit `style`): count down to the
  // real target instead of a fixed preset duration.
  if (scene.id === 'countdown' && !mergedProps.style) {
    const target = mergedProps.countdownTarget;
    const targetMs = typeof target === 'string' ? new Date(target).getTime() : NaN;
    if (Number.isFinite(targetMs)) {
      const diffSeconds = Math.ceil(Math.max(0, targetMs - Date.now()) / 1000);
      return Math.min(DATE_COUNTDOWN_MAX_SECONDS, Math.max(DATE_COUNTDOWN_MIN_SECONDS, diffSeconds));
    }
    return INVALID_TARGET_ADVANCE_SECONDS;
  }

  if (typeof scene.duration === 'number' && scene.duration > 0) {
    return scene.duration;
  }

  if (scene.duration === 'auto') {
    switch (scene.id) {
      case 'messageReveal':
        return readingTimeSeconds(stripHtml(String(mergedProps.message ?? '')));
      case 'finalMessage':
        return readingTimeSeconds(String(mergedProps.finalMessage ?? ''));
      case 'quote':
        return readingTimeSeconds(String(mergedProps.quote ?? ''));
      case 'gallery':
        return getGallerySceneDurationSeconds((mergedProps.images as MomentImage[]) ?? []);
      default:
        return DEFAULT_AUTO_DURATION_SECONDS;
    }
  }

  return DEFAULT_AUTO_DURATION_SECONDS;
}
