/**
 * Native Moment Builder step model — mirrors web Edit.vue editorSteps
 * (story from template step_config + fixed experience sections).
 */

export type TemplateStepType = 'text' | 'date' | 'image' | 'audio' | 'video' | string;

export type TemplateStepConfig = {
  id?: string;
  key?: string;
  type: TemplateStepType;
  label?: string;
  required?: boolean;
  max_length?: number;
  max_count?: number;
  min_count?: number;
  placeholder?: string;
  help?: string;
};

export type ExperienceSectionId =
  | 'background'
  | 'gallery'
  | 'countdown'
  | 'question'
  | 'lock'
  | 'sound'
  | 'playback';

export type BuilderStepKind = 'details' | 'story' | 'experience';

/** Stable navigation id — same pattern as web (`story:…`, `experience:…`). */
export type BuilderStepId = string;

export type BuilderStep =
  | {
      id: 'details';
      kind: 'details';
      label: string;
      description: string;
      required: boolean;
      implemented: true;
    }
  | {
      id: BuilderStepId;
      kind: 'story';
      label: string;
      description: string;
      required: boolean;
      implemented: boolean;
      step: TemplateStepConfig;
      stepId: string;
    }
  | {
      id: BuilderStepId;
      kind: 'experience';
      label: string;
      description: string;
      required: boolean;
      implemented: boolean;
      experienceId: ExperienceSectionId;
    };

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

export type NamesSaveResult = {
  saved: true;
  sender_name: string | null;
  receiver_name: string | null;
};

export type StepSaveResult = {
  saved: true;
  step_id: string;
  completed_steps: unknown;
  next_step: string | null;
  can_publish: boolean;
  missing_steps: string[];
};
