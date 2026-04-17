/**
 * Metrics API — proxy para dados ao vivo da Cloudia.
 *
 * OpenAPI:
 *  - /metrics/dashboard?clinicId=<int>&attendantType=<str, default "HUMAN">
 *  - /metrics/resumo?clinicId=<int>
 *  - /metrics/fila?clinicId=<int>
 *  - /metrics/completo?clinicId=<int>
 */

import { api } from "@/lib/api";
import { normalizeLiveMetrics } from "@/adapters/normalize";
import { cleanParams, toNumberOrUndef } from "@/api/params";
import type { LiveMetricsDto, MetricsDashboardParams } from "@/api/types";

export const metricsService = {
  async getDashboard(params: MetricsDashboardParams): Promise<LiveMetricsDto> {
    const { data } = await api.get<unknown>("/metrics/dashboard", {
      params: cleanParams({
        clinicId: params.clinicId,
        attendantType: params.attendantType ?? "HUMAN",
      }),
    });
    return normalizeLiveMetrics(data);
  },

  async getResumo(clinicId?: number): Promise<LiveMetricsDto> {
    const { data } = await api.get<unknown>("/metrics/resumo", {
      params: cleanParams({ clinicId }),
    });
    return normalizeLiveMetrics(data);
  },

  async getFila(clinicId?: number): Promise<LiveMetricsDto> {
    const { data } = await api.get<unknown>("/metrics/fila", {
      params: cleanParams({ clinicId }),
    });
    return normalizeLiveMetrics(data);
  },

  async getCompleto(clinicId?: number): Promise<LiveMetricsDto> {
    const { data } = await api.get<unknown>("/metrics/completo", {
      params: cleanParams({ clinicId }),
    });
    return normalizeLiveMetrics(data);
  },

  // ── Compat aliases ─────────────────────────────────────────────────
  resumo(clinicId?: number | string | null): Promise<LiveMetricsDto> {
    return this.getResumo(toNumberOrUndef(clinicId));
  },
  fila(clinicId?: number | string | null): Promise<LiveMetricsDto> {
    return this.getFila(toNumberOrUndef(clinicId));
  },
  completo(clinicId?: number | string | null): Promise<LiveMetricsDto> {
    return this.getCompleto(toNumberOrUndef(clinicId));
  },
};
