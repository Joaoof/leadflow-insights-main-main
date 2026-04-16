import { api } from "@/lib/api";
import type { Lead, LeadMetrics, UnitSummary } from "@/types";

export const analyticsService = {
  async leadMetrics(leadId: string): Promise<LeadMetrics> {
    const { data } = await api.get<LeadMetrics>(`/api/analytics/leads/${leadId}/metrics`);
    return data;
  },
  async unitLeadsMetrics(
    unitId: string,
    params: { startDate?: string; endDate?: string; state?: string } = {}
  ): Promise<LeadMetrics[]> {
    const { data } = await api.get<LeadMetrics[]>(
      `/api/analytics/units/${unitId}/leads-metrics`,
      { params }
    );
    return Array.isArray(data) ? data : [];
  },
  async unitSummary(
    unitId: string,
    params: { startDate?: string; endDate?: string } = {}
  ): Promise<UnitSummary> {
    const { data } = await api.get<UnitSummary>(
      `/api/analytics/units/${unitId}/summary`,
      { params }
    );
    return data;
  },
  async unitAlerts(unitId: string): Promise<LeadMetrics[]> {
    const { data } = await api.get<LeadMetrics[]>(
      `/api/analytics/units/${unitId}/alerts`
    );
    return Array.isArray(data) ? data : [];
  },
  async unitDashboardToday(unitId: string): Promise<{
    summary: UnitSummary;
    alerts: LeadMetrics[];
    topAttendants: Array<{ name: string; conversions: number; total: number }>;
  }> {
    const { data } = await api.get(`/api/analytics/units/${unitId}/dashboard/today`);
    return data;
  },
};
