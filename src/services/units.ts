/**
 * Units API — rotas /units/*.
 *
 * OpenAPI:
 *  - GET /units
 *  - GET /units/{clinicId:int}
 *  - PUT /units/{clinicId:int}  -> body: `string` (NÃO é objeto!).
 *  - GET /units/quantity-leads?clinicId=<int>
 */

import { api } from "@/lib/api";
import {
  normalizeUnit,
  normalizeUnitList,
  extractCountFromResponse,
} from "@/adapters/normalize";
import { cleanParams, toNumberOrUndef } from "@/api/params";
import type { UnitDto } from "@/api/types";

export const unitsService = {
  async list(): Promise<UnitDto[]> {
    const { data } = await api.get<unknown>("/units");
    return normalizeUnitList(data);
  },

  async getByClinicId(clinicId: number | string): Promise<UnitDto> {
    const id = toNumberOrUndef(clinicId) ?? 0;
    const { data } = await api.get<unknown>(`/units/${id}`);
    return normalizeUnit(data);
  },

  /**
   * PUT /units/{clinicId}
   * IMPORTANTE: o contrato OpenAPI declara que o body é `string` cru
   * (não um objeto). Enviamos `JSON.stringify(name)` — axios faria isso
   * automaticamente, mas deixamos explícito para auditabilidade.
   */
  async updateName(clinicId: number | string, name: string): Promise<UnitDto> {
    const id = toNumberOrUndef(clinicId) ?? 0;
    const { data } = await api.put<unknown>(
      `/units/${id}`,
      JSON.stringify(name),
      { headers: { "Content-Type": "application/json" } }
    );
    return normalizeUnit(data);
  },

  async getQuantityLeads(clinicId?: number | string | null): Promise<number> {
    const { data } = await api.get<unknown>("/units/quantity-leads", {
      params: cleanParams({ clinicId: toNumberOrUndef(clinicId) }),
    });
    return extractCountFromResponse(data);
  },

  /**
   * Compat legado — obtém uma unidade pelo clinicId, criando-a no
   * backend se necessário. O endpoint `GET /units/{clinicId}` faz o
   * upsert no backend atual.
   */
  getOrCreate(clinicId: number | string): Promise<UnitDto> {
    return this.getByClinicId(clinicId);
  },
};
