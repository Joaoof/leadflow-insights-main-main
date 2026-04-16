import { api } from "@/lib/api";
import type { Attendant, AttendantRanking } from "@/types";

export const assignmentsService = {
  async listAttendants(): Promise<Attendant[]> {
    const { data } = await api.get<Attendant[]>("/assignments/attendants");
    return Array.isArray(data) ? data : [];
  },
  async leadHistory(externalLeadId: string, clinicId?: string): Promise<any[]> {
    const { data } = await api.get(`/assignments/lead/${externalLeadId}`, {
      params: { clinicId },
    });
    return Array.isArray(data) ? data : [];
  },
  async ranking(clinicId?: string): Promise<AttendantRanking[]> {
    const { data } = await api.get<AttendantRanking[]>(`/assignments/ranking`, {
      params: { clinicId },
    });
    return Array.isArray(data) ? data : [];
  },
  async syncLead(payload: Record<string, any>): Promise<any> {
    const { data } = await api.post("/assignments/sync", payload);
    return data;
  },
};
