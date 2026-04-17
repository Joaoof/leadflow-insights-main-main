/**
 * LeadAnalytics API — rotas /api/analytics/*.
 *
 * Path params são inteiros conforme OpenAPI:
 *  - /api/analytics/leads/{id:int}/metrics
 *  - /api/analytics/units/{unitId:int}/leads-metrics
 *  - /api/analytics/units/{unitId:int}/summary
 *  - /api/analytics/units/{unitId:int}/alerts
 *  - /api/analytics/units/{unitId:int}/dashboard/today
 *
 * Datas (`startDate`, `endDate`) viajam como ISO date-time.
 */

import { api } from "@/lib/api";
import {
  normalizeLeadMetrics,
  normalizeLeadMetricsList,
  normalizeUnitDashboardToday,
  normalizeUnitSummary,
} from "@/adapters/normalize";
import { cleanParams, toIsoDateTime, toNumberOrUndef } from "@/api/params";
import type {
  LeadMetricsDto,
  UnitDashboardTodayDto,
  UnitLeadsMetricsParams,
  UnitSummaryDto,
  UnitSummaryParams,
} from "@/api/types";

export const analyticsService = {
  async getLeadMetrics(id: number): Promise<LeadMetricsDto> {
    const { data } = await api.get<unknown>(
      `/api/analytics/leads/${id}/metrics`
    );
    return normalizeLeadMetrics(data);
  },

  async getUnitLeadsMetrics(
    unitId: number,
    params: UnitLeadsMetricsParams = {}
  ): Promise<LeadMetricsDto[]> {
    const { data } = await api.get<unknown>(
      `/api/analytics/units/${unitId}/leads-metrics`,
      {
        params: cleanParams({
          startDate: toIsoDateTime(params.startDate),
          endDate: toIsoDateTime(params.endDate),
          state: params.state,
        }),
      }
    );
    return normalizeLeadMetricsList(data);
  },

  async getUnitSummary(
    unitId: number,
    params: UnitSummaryParams = {}
  ): Promise<UnitSummaryDto> {
    const { data } = await api.get<unknown>(
      `/api/analytics/units/${unitId}/summary`,
      {
        params: cleanParams({
          startDate: toIsoDateTime(params.startDate),
          endDate: toIsoDateTime(params.endDate),
        }),
      }
    );
    return normalizeUnitSummary(data);
  },

  async getUnitAlerts(unitId: number): Promise<LeadMetricsDto[]> {
    const { data } = await api.get<unknown>(
      `/api/analytics/units/${unitId}/alerts`
    );
    return normalizeLeadMetricsList(data);
  },

  async getUnitDashboardToday(unitId: number): Promise<UnitDashboardTodayDto> {
    const { data } = await api.get<unknown>(
      `/api/analytics/units/${unitId}/dashboard/today`
    );
    return normalizeUnitDashboardToday(data);
  },

  // ── Compat aliases — aceitam string|number para IDs ────────────────
  leadMetrics(id: number | string): Promise<LeadMetricsDto> {
    return this.getLeadMetrics(toNumberOrUndef(id) ?? 0);
  },
  unitLeadsMetrics(
    unitId: number | string,
    params: UnitLeadsMetricsParams = {}
  ): Promise<LeadMetricsDto[]> {
    return this.getUnitLeadsMetrics(toNumberOrUndef(unitId) ?? 0, params);
  },
  unitSummary(
    unitId: number | string,
    params: UnitSummaryParams = {}
  ): Promise<UnitSummaryDto> {
    return this.getUnitSummary(toNumberOrUndef(unitId) ?? 0, params);
  },
  unitAlerts(unitId: number | string): Promise<LeadMetricsDto[]> {
    return this.getUnitAlerts(toNumberOrUndef(unitId) ?? 0);
  },
};
