import type { Moment } from '@/types/api';

import type {
  BuilderStep,
  ExperienceSectionId,
  TemplateStepConfig,
} from '@/features/builder/types';

const STORY_STEP_ORDER: Record<string, number> = {
  text: 1,
  date: 2,
  image: 3,
  audio: 4,
};

/** Mirrors EXPERIENCE_STEP_ITEMS in web Moment/Edit.vue */
const EXPERIENCE_STEP_ITEMS: {
  id: ExperienceSectionId;
  label: string;
  description: string;
}[] = [
  {
    id: 'background',
    label: 'Look',
    description: 'Choose a mood, then refine atmosphere and type.',
  },
  {
    id: 'gallery',
    label: 'Photos',
    description: 'Choose how photos show, then add yours.',
  },
  {
    id: 'countdown',
    label: 'Countdown',
    description: 'A short wait before your message shows up.',
  },
  {
    id: 'question',
    label: 'Question',
    description: 'Ask them something first, if you want.',
  },
  {
    id: 'lock',
    label: 'Lock',
    description: 'A passcode, a pattern, or a question only they know.',
  },
  {
    id: 'sound',
    label: 'Music',
    description: 'Add a song — yours, or one of ours.',
  },
  {
    id: 'playback',
    label: 'Order',
    description: 'Change the order things play in.',
  },
];

function resolveStepId(step: TemplateStepConfig): string {
  return String(step.id || step.key || '');
}

function getStoryStepTitle(step: TemplateStepConfig): string {
  if (step.label?.trim()) return step.label.trim();
  if (step.type === 'text') return 'Your message';
  if (step.type === 'date') return 'Date';
  return 'Step';
}

function getStoryStepDescription(step: TemplateStepConfig): string {
  if (step.help?.trim()) return step.help.trim();
  if (step.type === 'text') return 'Write it in your own words.';
  if (step.type === 'date') return 'Pick a date that matters.';
  return '';
}

function readTemplateSteps(moment: Moment): TemplateStepConfig[] {
  const raw = moment.template?.step_config;
  if (!raw || typeof raw !== 'object') return [];
  const steps = (raw as { steps?: unknown }).steps;
  if (!Array.isArray(steps)) return [];
  return steps.filter(
    (s): s is TemplateStepConfig =>
      Boolean(s) && typeof s === 'object' && typeof (s as TemplateStepConfig).type === 'string',
  );
}

/**
 * Build the native editor step list from a loaded Moment.
 * Order matches web: Details (names) → Content story steps → Experience sections.
 * Image/audio template steps are folded into Photos / Music (not separate content steps).
 */
export function buildEditorSteps(moment: Moment): BuilderStep[] {
  const templateSteps = readTemplateSteps(moment);

  const storySorted = [...templateSteps]
    .map((step, index) => ({ step, index }))
    .sort((a, b) => {
      const orderA = STORY_STEP_ORDER[a.step.type] ?? 99;
      const orderB = STORY_STEP_ORDER[b.step.type] ?? 99;
      if (orderA !== orderB) return orderA - orderB;
      return a.index - b.index;
    })
    .map(({ step }) => step)
    .filter((step) => !['image', 'audio'].includes(step.type));

  const galleryRequired = Boolean(
    templateSteps.find((item) => item.type === 'image')?.required,
  );
  const soundRequired = Boolean(
    templateSteps.find((item) => item.type === 'audio')?.required,
  );

  const details: BuilderStep = {
    id: 'details',
    kind: 'details',
    label: 'Details',
    description: 'Who this Moment is for — and who it’s from.',
    required: false,
    implemented: true,
  };

  const storySteps: BuilderStep[] = storySorted
    .map((step) => {
      const stepId = resolveStepId(step);
      if (!stepId) return null;
      return {
        id: `story:${stepId}`,
        kind: 'story' as const,
        label: getStoryStepTitle(step),
        description: getStoryStepDescription(step),
        required: Boolean(step.required),
        implemented: step.type === 'text' || step.type === 'date',
        step,
        stepId,
      };
    })
    .filter((s): s is Extract<BuilderStep, { kind: 'story' }> => s != null);

  const experienceSteps: BuilderStep[] = EXPERIENCE_STEP_ITEMS.map((item) => ({
    id: `experience:${item.id}`,
    kind: 'experience' as const,
    label: item.label,
    description:
      item.id === 'gallery' && galleryRequired
        ? 'Add at least one photo. You can add more, up to the template limit.'
        : item.description,
    required:
      item.id === 'gallery' ? galleryRequired : item.id === 'sound' ? soundRequired : false,
    implemented: true,
    experienceId: item.id,
  }));

  return [details, ...storySteps, ...experienceSteps];
}
