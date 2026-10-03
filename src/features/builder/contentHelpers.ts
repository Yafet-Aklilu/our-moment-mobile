import type { Moment, MomentContentRow } from '@/types/api';
import type { TemplateStepConfig } from '@/features/builder/types';

/** Unwrap content row value from API `{ value, type }` or raw string. */
export function readContentValue(
  content: MomentContentRow[] | undefined,
  stepId: string,
): string {
  const row = content?.find((c) => c.step_id === stepId);
  if (!row) return '';
  const raw = row.content;
  if (raw == null) return '';
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'object' && raw !== null && 'value' in raw) {
    const value = (raw as { value: unknown }).value;
    return typeof value === 'string' ? value : value == null ? '' : String(value);
  }
  return '';
}

export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Store plain text as simple HTML paragraphs so web player still renders. */
export function plainTextToHtml(text: string): string {
  const trimmed = text.trim();
  if (!trimmed) return '';
  return trimmed
    .split(/\n+/)
    .map((line) => `<p>${escapeHtml(line)}</p>`)
    .join('');
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function findTemplateSteps(moment: Moment): TemplateStepConfig[] {
  const raw = moment.template?.step_config;
  if (!raw || typeof raw !== 'object') return [];
  const steps = (raw as { steps?: unknown }).steps;
  if (!Array.isArray(steps)) return [];
  return steps.filter(
    (s): s is TemplateStepConfig =>
      Boolean(s) && typeof s === 'object' && typeof (s as TemplateStepConfig).type === 'string',
  );
}

export function findImageStepId(moment: Moment): string | null {
  const step = findTemplateSteps(moment).find((s) => s.type === 'image');
  if (!step) return null;
  return String(step.id || step.key || '') || null;
}

export function findAudioStepId(moment: Moment): string | null {
  const step = findTemplateSteps(moment).find((s) => s.type === 'audio');
  if (!step) return null;
  return String(step.id || step.key || '') || null;
}

export function asSettings(moment: Moment): Record<string, unknown> {
  return moment.settings && typeof moment.settings === 'object'
    ? { ...moment.settings }
    : {};
}
