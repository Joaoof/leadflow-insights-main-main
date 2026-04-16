import { api } from "@/lib/api";

export const reportsService = {
  async monthly(params: { clinicId: string; mes: number; ano: number }) {
    const res = await api.get("/api/relatorios/mensal", {
      params,
      responseType: "blob",
    });
    const blob = new Blob([res.data], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-${params.ano}-${String(params.mes).padStart(2, "0")}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },

  async daily(params: { tenantId: string; date: string }) {
    const { data } = await api.get("/daily-relatory/generate", { params });
    return data;
  },
};
