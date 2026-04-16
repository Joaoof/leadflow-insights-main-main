import { api } from "@/lib/api";
import type { Lead, OrigemAgrupada, StageCount, StateCount, TimeSeriesPoint } from "@/types";

export interface LeadFilters {
  clinicId?: string;
  search?: string;
  stage?: string;
  state?: string;
  source?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
}

export const webhooksService = {
  async listLeads(filters: LeadFilters = {}): Promise<Lead[]> {
    const { data } = await api.get<Lead[]>("/webhooks", {
      params: cleanParams(filters),
    });
    return Array.isArray(data) ? data : [];
  },

  async consultas(clinicId?: string): Promise<number> {
    const { data } = await api.get("/webhooks/consultas", {
      params: { clinicId },
    });
    return extractCount(data);
  },

  async semPagamento(clinicId?: string): Promise<number> {
    const { data } = await api.get("/webhooks/sem-pagamento", {
      params: { clinicId },
    });
    return extractCount(data);
  },

  async comPagamento(clinicId?: string): Promise<number> {
    const { data } = await api.get("/webhooks/com-pagamento", {
      params: { clinicId },
    });
    return extractCount(data);
  },

  async sourceFinal(clinicId?: string): Promise<Array<{ source: string; count: number }>> {
    const { data } = await api.get("/webhooks/source-final", {
      params: { clinicId },
    });
    return normalizeGroup(data, "source");
  },

  async origemCloudia(clinicId?: string): Promise<OrigemAgrupada[]> {
    const { data } = await api.get<OrigemAgrupada[]>("/webhooks/origem-cloudia", {
      params: { clinicId },
    });
    return Array.isArray(data) ? data : [];
  },

  async fimDeSemana(clinicId?: string): Promise<Lead[]> {
    const { data } = await api.get<Lead[]>("/webhooks/fim-de-semana", {
      params: { clinicId },
    });
    return Array.isArray(data) ? data : [];
  },

  async etapaAgrupada(clinicId?: string): Promise<StageCount[]> {
    const { data } = await api.get("/webhooks/etapa-agrupada", {
      params: { clinicId },
    });
    return normalizeGroup(data, "stage");
  },

  async buscarInicioFim(params: {
    clinicId?: string;
    dataInicio: string;
    dataFim: string;
  }): Promise<TimeSeriesPoint[]> {
    const { data } = await api.get("/webhooks/buscar-inicio-fim", { params });
    return normalizeSeries(data);
  },

  async consultaPeriodos(params: {
    clinicId?: string;
    ano?: number;
    mes?: number;
    dia?: number;
  }): Promise<TimeSeriesPoint[]> {
    const { data } = await api.get("/webhooks/consulta-periodos", { params });
    return normalizeSeries(data);
  },

  async activeLeads(params: { limit?: number; unitId?: string } = {}): Promise<Lead[]> {
    const { data } = await api.get<Lead[]>("/webhooks/active", { params });
    return Array.isArray(data) ? data : [];
  },

  async countByState(unitId?: string): Promise<StateCount> {
    const { data } = await api.get<StateCount>("/webhooks/count-by-state", {
      params: { unitId },
    });
    return (
      data ?? { bot: 0, queue: 0, service: 0, concluido: 0, total: 0 }
    );
  },

  async syncHealth(): Promise<any> {
    const { data } = await api.get("/webhooks/sync/health");
    return data;
  },
};

function cleanParams(obj: Record<string, any>) {
  const out: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined && v !== null && v !== "") out[k] = v;
  }
  return out;
}

function extractCount(data: any): number {
  if (typeof data === "number") return data;
  if (typeof data?.count === "number") return data.count;
  if (typeof data?.total === "number") return data.total;
  if (typeof data?.quantidade === "number") return data.quantidade;
  return 0;
}

function normalizeGroup(data: any, key: "source" | "stage"): Array<any> {
  if (!Array.isArray(data)) return [];
  return data.map((it) => ({
    [key]: it[key] ?? it.origem ?? it.etapa ?? it.name ?? "—",
    count: it.count ?? it.quantidade ?? it.total ?? 0,
    ...it,
  }));
}

function normalizeSeries(data: any): TimeSeriesPoint[] {
  if (!Array.isArray(data)) return [];
  return data.map((it) => ({
    periodo: it.periodo ?? it.mes ?? it.data ?? it.label ?? "—",
    total: it.total ?? it.count ?? it.quantidade ?? 0,
  }));
}
