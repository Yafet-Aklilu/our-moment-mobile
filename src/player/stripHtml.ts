/**
 * Strip HTML markup down to plain, readable text for native `<Text>`.
 *
 * Web scenes (`SceneMessageReveal.vue`, question prompts, etc.) render
 * sanitized rich text via `v-html`. The native player has no HTML renderer,
 * so we convert block/line breaks to `\n` and drop every tag, keeping the
 * paragraph rhythm the sender authored.
 */
export function stripHtml(html: string | null | undefined): string {
  if (!html || typeof html !== 'string') return '';

  return html
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;/gi, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
