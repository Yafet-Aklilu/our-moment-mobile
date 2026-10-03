import { apiClient, unwrapData } from '@/api/client';
import type { ApiSuccessEnvelope, Template, TemplateSummary } from '@/types/api';

/**
 * GET /templates returns a Laravel paginated resource collection
 * ({ data, links, meta }) — not ApiResponse::data wrapping.
 */
export const templatesApi = {
  async list(params?: { page?: number; per_page?: number; audience?: string }) {
    const { data } = await apiClient.get<{
      data: TemplateSummary[];
      links?: unknown;
      meta?: Record<string, unknown>;
    }>('/templates', { params });
    return data;
  },

  async get(id: number): Promise<Template> {
    const { data } = await apiClient.get<ApiSuccessEnvelope<Template>>(
      `/templates/${id}`,
    );
    return unwrapData(data);
  },
};
