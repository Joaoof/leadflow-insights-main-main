import { api } from "@/lib/api";
import type { Unit } from "@/types";

export const unitsService = {
  async list(): Promise<Unit[]> {
    const { data } = await api.get<Unit[]>("/units");
    return Array.isArray(data) ? data : [];
  },
  async getOrCreate(clinicId: string): Promise<Unit> {
    const { data } = await api.get<Unit>(`/units/${clinicId}`);
    return data;
  },
  async updateName(clinicId: string, name: string): Promise<Unit> {
    const { data } = await api.put<Unit>(`/units/${clinicId}`, { name });
    return data;
  },
  async quantityLeads(clinicId?: string): Promise<number> {
    const { data } = await api.get("/units/quantity-leads", {
      params: { clinicId },
    });
    if (typeof data === "number") return data;
    return data?.total ?? data?.count ?? 0;
  },
};
