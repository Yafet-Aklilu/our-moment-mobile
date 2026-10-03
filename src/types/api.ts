/**
 * Mobile-facing TypeScript contracts derived from:
 * our-moment-web/app/Http/Resources/Api/V1/*
 * our-moment-web/routes/api.php
 * our-moment-web/app/Support/ApiResponse.php
 *
 * Do not invent fields. Prefer optional when Laravel `when` / `whenLoaded` may omit.
 */

export type MomentState = 'draft' | 'activated';

/** UI labels mirrored from web Moments/Index — not alternate product language. */
export const MOMENT_STATE_LABEL: Record<MomentState, string> = {
  draft: 'Still editing',
  activated: 'Sent',
};

export type ApiSuccessEnvelope<T> = { data: T };

export type ApiErrorEnvelope = {
  message: string;
  code: string;
  details?: Record<string, unknown>;
};

export type ValidationErrorEnvelope = {
  message: string;
  errors: Record<string, string[]>;
};

export type User = {
  id: number;
  name: string;
  email: string;
  credits: number;
  free_moment_publish_enabled: boolean;
  created_at: string | null;
  updated_at: string | null;
};

export type AuthTokenPayload = {
  token: string;
  token_type: 'Bearer' | string;
  user: User;
};

export type TemplateCategory = {
  id: number;
  name: string;
  slug: string;
};

export type TemplateSummary = {
  id: number;
  name: string;
  title: string;
  slug: string;
  short_description: string | null;
  cover_image: string | null;
  audience: string | null;
  sort_order: number | null;
  category?: TemplateCategory | null;
};

export type Template = TemplateSummary & {
  step_config: unknown;
};

export type MomentTemplateMini = {
  id: number;
  name: string;
  title: string;
  slug: string;
  cover_image: string | null;
};

export type MomentSummary = {
  id: number;
  state: MomentState;
  receiver_name: string | null;
  sender_name: string | null;
  activated_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  can_delete: boolean;
  reactions_count: number;
  public_share_url: string | null;
  template?: MomentTemplateMini | null;
};

export type MomentContentRow = {
  step_id: string;
  content: unknown;
  is_autosave: boolean;
};

export type MediaItem = {
  id: number;
  step_id: string | null;
  type: string | null;
  url: string;
  order: number | null;
  original_filename: string | null;
  caption: string | null;
  description: string | null;
};

export type MomentCompletion = {
  completed_steps: unknown;
  next_step: string | null;
  can_publish: boolean;
  missing_steps: string[];
};

export type Moment = MomentSummary & {
  moment_id: number;
  theme: unknown;
  settings: Record<string, unknown>;
  is_public: boolean;
  public_token?: string | null;
  public_access_revoked_at: string | null;
  template?: (MomentTemplateMini & { step_config?: unknown }) | null;
  content?: MomentContentRow[];
  media?: MediaItem[];
  completion?: MomentCompletion;
};

export type Reaction = {
  id: number;
  reaction_type: string | null;
  emoji: string | null;
  message: string | null;
  is_public: boolean;
  viewer_name: string | null;
  created_at: string | null;
};

export type Paginated<T> = {
  data: T[];
  links?: unknown;
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    [key: string]: unknown;
  };
};

export type CreditsBalance = { credits: number };

export type ActivationStatus = {
  state: MomentState;
  public_link: string | null;
  public_token: string | null;
  credits_remaining: number;
};

export type MomentPreview = {
  moment_id: number;
  state: MomentState;
  config: unknown;
  can_publish: boolean;
  missing_steps: string[];
};

export type PublicMomentPayload = {
  public_token: string;
  moment_id: number;
  state: MomentState;
  is_creator: boolean;
  config: unknown;
};

export type ReactionsInbox = {
  reactions: Reaction[];
  total_count: number;
  public_count: number;
};
