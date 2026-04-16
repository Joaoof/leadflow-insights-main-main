import { api } from "@/lib/api";
import type { LiveMetrics } from "@/types";

export const metricsService = {
  async dashboard(params: { clinicId?: string; attendantType?: string }): Promise<LiveMetrics> {
    const { data } = await api.get<LiveMetrics>("/metrics/dashboard", { params });
    return data ?? {};
  },
  async resumo(clinicId?: string): Promise<LiveMetrics> {
    const { data } = await api.get<LiveMetrics>("/metrics/resumo", {
      params: { clinicId },
    });
    return data ?? {};
  },
  async fila(clinicId?: string): Promise<LiveMetrics> {
    const { data } = await api.get<LiveMetrics>("/metrics/fila", {
      params: { clinicId },
    });
    return data ?? {};
  },
  async completo(clinicId?: string): Promise<LiveMetrics> {
    const { data } = await api.get<LiveMetrics>("/metrics/completo", {
      params: { clinicId },
    });
    return data ?? {};
  },
};
