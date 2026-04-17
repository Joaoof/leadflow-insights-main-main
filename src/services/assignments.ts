/**
 * Assignments API — rotas /assignments/*.
 *
 * OpenAPI:
 *  - GET /assignments/attendants
 *  - GET /assignments/lead/{externalLeadId:int}?clinicId=<int>
 *  - GET /assignments/ranking?clinicId=<int>
 *  - POST /assignments/sync (body: SyncLeadDto)
 */

import { api } from "@/lib/api";
import {
  normalizeAssignmentHistory,
  normalizeAttendantList,
  normalizeRanking,
} from "@/adapters/normalize";
import { cleanParams, toNumberOrUndef } from "@/api/params";
import type {
  AttendantDto,
  AttendantRankingDto,
  LeadAssignmentHistoryDto,
  SyncLeadDto,
} from "@/api/types";

export const assignmentsService = {
  async getAttendants(): Promise<AttendantDto[]> {
    const { data } = await api.get<unknown>("/assignments/attendants");
    return normalizeAttendantList(data);
  },

  async getLeadAssignments(
    externalLeadId: number,
    clinicId?: number
  ): Promise<LeadAssignmentHistoryDto[]> {
    const { data } = await api.get<unknown>(
      `/assignments/lead/${externalLeadId}`,
      {
        params: cleanParams({ clinicId }),
      }
    );
    return normalizeAssignmentHistory(data);
  },

  async getRanking(clinicId?: number): Promise<AttendantRankingDto[]> {
    const { data } = await api.get<unknown>("/assignments/ranking", {
      params: cleanParams({ clinicId }),
    });
    return normalizeRanking(data);
  },

  /** POST /assignments/sync — body tipado em `SyncLeadDto`. */
  async syncLead(payload: SyncLeadDto): Promise<unknown> {
    const { data } = await api.post<unknown>("/assignments/sync", payload);
    return data;
  },

  // ── Compat aliases ─────────────────────────────────────────────────
  listAttendants(): Promise<AttendantDto[]> {
    return this.getAttendants();
  },
  ranking(clinicId?: number | string | null): Promise<AttendantRankingDto[]> {
    return this.getRanking(toNumberOrUndef(clinicId));
  },
  leadHistory(
    externalLeadId: number | string,
    clinicId?: number | string | null
  ): Promise<LeadAssignmentHistoryDto[]> {
    return this.getLeadAssignments(
      toNumberOrUndef(externalLeadId) ?? 0,
      toNumberOrUndef(clinicId)
    );
  },
};
