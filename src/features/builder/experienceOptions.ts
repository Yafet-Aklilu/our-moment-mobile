/**
 * Experience option catalogs — mirrors MomentEditController experienceOptions
 * + MomentExperienceSettingsService enums (hardcoded on web; no v1 catalog API).
 */

export const MOODS = [
  { id: 'romantic', label: 'Romantic' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'playful', label: 'Playful' },
  { id: 'editorial', label: 'Editorial' },
  { id: 'handwritten', label: 'Handwritten' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'celebration', label: 'Celebration' },
  { id: 'memories', label: 'Memories' },
] as const;

export const BACKGROUND_STYLES = [
  { id: 'romantic-atmosphere', label: 'Romantic atmosphere' },
  { id: 'cinematic-dark', label: 'Cinematic dark' },
  { id: 'warm-paper', label: 'Warm paper' },
  { id: 'dreamy-glow', label: 'Dreamy glow' },
  { id: 'minimal-luxury', label: 'Minimal luxury' },
  { id: 'playful-graphic', label: 'Playful' },
  { id: 'editorial-cream', label: 'Editorial cream' },
  { id: 'celebration-spark', label: 'Celebration' },
  { id: 'memory-haze', label: 'Memory haze' },
  { id: 'midnight-velvet', label: 'Midnight velvet' },
  { id: 'sunlit-bloom', label: 'Sunlit bloom' },
] as const;

export const GALLERY_STYLES = [
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'polaroid', label: 'Polaroid' },
  { id: 'coverflow', label: 'Coverflow' },
  { id: 'floating', label: 'Floating' },
] as const;

export const COUNTDOWN_STYLES = [
  { id: 'circle', label: 'Circle' },
  { id: 'cinematic', label: 'Cinematic' },
  { id: 'flip', label: 'Flip' },
  { id: 'minimal', label: 'Minimal' },
  { id: 'journey', label: 'Journey' },
] as const;

export const QUESTION_TYPES = [
  { id: 'continue', label: 'Continue' },
  { id: 'yes-no', label: 'Yes / No' },
  { id: 'multiple-choice', label: 'Multiple choice' },
] as const;

export const LOCK_TYPES = [
  { id: 'swipe', label: 'Swipe' },
  { id: 'iphone-passcode', label: 'Passcode' },
  { id: 'pattern', label: 'Pattern' },
  { id: 'heart-sequence', label: 'Heart sequence' },
  { id: 'memory-question', label: 'Memory question' },
] as const;

export const PLAYBACK_SCENE_OPTIONS = [
  { id: 'lock', label: 'Lock' },
  { id: 'preload', label: 'Opening' },
  { id: 'title', label: 'Title' },
  { id: 'gallery', label: 'Photos' },
  { id: 'countdown', label: 'Countdown' },
  { id: 'question', label: 'Question' },
  { id: 'messageReveal', label: 'Message' },
  { id: 'memoryImage', label: 'Memory photo' },
  { id: 'quote', label: 'Quote' },
  { id: 'finalMessage', label: 'Closing' },
  { id: 'cta', label: 'End' },
] as const;

export const JOURNEY_HEAD_STEP_ID = '__journey_countdown_head_image';
export const JOURNEY_END_STEP_ID = '__journey_countdown_end_image';
export const EXPERIENCE_SOUND_STEP_ID = 'experience:sound';
