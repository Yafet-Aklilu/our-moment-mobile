/**
 * TypeScript contract for the Moment Player config.
 *
 * Mirrors the JSON shape produced by:
 *   our-moment-web/app/Services/MomentConfigBuilder.php
 * and consumed by the web player scenes:
 *   our-moment-web/resources/js/utils/resolveMomentScenes.js
 *   our-moment-web/resources/js/moment-types/*.js
 *
 * Owner/admin contexts (this preview) receive the *full* config — lock
 * passcodes, patterns, sequences and question answers are present (no
 * `remote` verification indirection). Do not assume `remote`/`verifyUrl`
 * fields are populated here; they only appear on the public (recipient)
 * config variant.
 */

/** Category-derived moment mood. Drives which default scene sequence plays. */
export type MomentType = 'celebration' | 'love' | 'apology' | 'memorial' | string;

export type MomentTheme = {
  /** Accent color, e.g. `#FF6C71`. */
  primary?: string;
  /** CSS background — solid color or CSS gradient string. Approximate only. */
  background?: string;
  /** Primary text color, e.g. `#FFF5F0`. */
  text?: string;
  /** CSS font stack — not used natively; app typography is used instead. */
  fontFamily?: string;
  backgroundStyle?: string;
  background_style?: string;
  mood?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  ctaTitle?: string;
  ctaSubtitle?: string;
  createMomentUrl?: string;
  createMomentLabel?: string;
  reactionAvailable?: boolean;
  reactionLabel?: string;
  shareStoryAvailable?: boolean;
  [key: string]: unknown;
};

export type MomentImage = {
  id: string;
  url: string;
  alt?: string | null;
  caption?: string | null;
  detail?: string | null;
};

export type MomentQuestionType = 'continue' | 'yes-no' | 'multiple-choice';

export type MomentQuestionContent = {
  type?: MomentQuestionType;
  text?: string | null;
  options?: string[];
  /** Present in owner/preview config; absent (null) on public/remote config. */
  correctIndex?: number | null;
  strict?: boolean;
  continueLabel?: string;
  buttonLabel?: string;
  yesLabel?: string;
  noLabel?: string;
  /** Only present on the public config variant — never true here. */
  remote?: boolean;
  verifyUrl?: string | null;
};

export type MomentLockType =
  | 'swipe'
  | 'iphone-passcode'
  | 'pattern'
  | 'heart-sequence'
  | 'memory-question';

export type MomentLockContent = {
  type?: MomentLockType;
  passcode?: string | null;
  pattern?: number[];
  sequence?: number[];
  question?: string | null;
  options?: string[];
  correctIndex?: number | null;
  hint?: string | null;
  message?: string | null;
  remote?: boolean;
  verifyUrl?: string | null;
  passcodeLength?: number;
  sequenceLength?: number;
};

export type MomentCountdownContent = {
  style?: string;
  duration?: number;
  text?: string;
  headImage?: string;
  endIcon?: string;
};

export type MomentGalleryContent = {
  style?: string;
};

export type MomentContent = {
  title?: string;
  subtitle?: string;
  message?: string;
  finalMessage?: string;
  quote?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  images?: MomentImage[];
  countdownTarget?: string | null;
  specialDate?: string | null;
  audioUrl?: string | null;
  soundYoutubeVideoId?: string | null;
  soundYoutubeUrl?: string | null;
  soundDurationSeconds?: number | null;
  question?: MomentQuestionContent | null;
  lock?: MomentLockContent | null;
  gallery?: MomentGalleryContent;
  countdown?: MomentCountdownContent;
  [key: string]: unknown;
};

/** Server-authored override/insertion for a scene in the default preset sequence. */
export type MomentSceneOverride = {
  id: string;
  /** Insertion index when the id isn't already in the preset sequence. */
  order?: number;
  duration?: number | 'auto';
  /** Removes this occurrence of the scene from the resolved sequence. */
  skip?: boolean;
  props?: Record<string, unknown>;
};

export type MomentPlaybackSceneOrderEntry = {
  id: string;
  occurrence: number;
};

export type MomentPlayback = {
  sceneOrder?: MomentPlaybackSceneOrderEntry[];
};

export type MomentMetadata = {
  title?: string;
  author?: string | null;
  createdAt?: string | null;
  categorySlug?: string | null;
};

/** Full Moment Player config — see `MomentConfigBuilder::build()`. */
export type MomentConfig = {
  version: string;
  id: string;
  type: MomentType;
  theme: MomentTheme;
  metadata: MomentMetadata;
  content: MomentContent;
  scenes: MomentSceneOverride[];
  playback: MomentPlayback;
  autoplay?: boolean;
};

/**
 * Narrow an arbitrary `MomentPreview.config` (typed `unknown` in
 * `src/types/api.ts`) down to a `MomentConfig` once we've confirmed it has
 * the minimum required shape. Returns `null` for empty/invalid configs so
 * callers can show the "incomplete" preview state instead of crashing.
 */
export function asMomentConfig(raw: unknown): MomentConfig | null {
  if (!raw || typeof raw !== 'object') return null;
  const candidate = raw as Partial<MomentConfig>;
  if (typeof candidate.type !== 'string') return null;
  if (!candidate.content || typeof candidate.content !== 'object') return null;

  return {
    version: typeof candidate.version === 'string' ? candidate.version : '1.0',
    id: typeof candidate.id === 'string' ? candidate.id : '',
    type: candidate.type,
    theme: (candidate.theme && typeof candidate.theme === 'object' ? candidate.theme : {}) as MomentTheme,
    metadata: (candidate.metadata && typeof candidate.metadata === 'object'
      ? candidate.metadata
      : {}) as MomentMetadata,
    content: candidate.content as MomentContent,
    scenes: Array.isArray(candidate.scenes) ? candidate.scenes : [],
    playback: (candidate.playback && typeof candidate.playback === 'object'
      ? candidate.playback
      : {}) as MomentPlayback,
    autoplay: candidate.autoplay !== false,
  };
}

/**
 * A config counts as "empty" (nothing worth previewing) when it has no
 * title, message, images, or final message — i.e. an untouched draft.
 */
export function isMomentConfigEmpty(config: MomentConfig | null): boolean {
  if (!config) return true;
  const c = config.content ?? {};
  const hasText = Boolean(
    (c.title && c.title !== 'Special Moment') ||
      (c.message && c.message.trim()) ||
      (c.finalMessage && c.finalMessage.trim()) ||
      (c.quote && c.quote.trim()),
  );
  const hasImages = Array.isArray(c.images) && c.images.length > 0;
  return !hasText && !hasImages;
}
