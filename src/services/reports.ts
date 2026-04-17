/**
 * Compat shim — mantém a API antiga usada por páginas existentes
 * (ReportsPage, DashboardPage). Internamente delega ao service oficial
 * `relatoriosService`, que segue estritamente o contrato OpenAPI.
 */

import {
  relatoriosService,
  downloadBlob,
  type MonthlyReportBlob,
} from "@/services/relatorios";
import type { DailyReportParams, MonthlyReportParams } from "@/api/types";

export const reportsService = {
  async monthly(params: MonthlyReportParams): Promise<MonthlyReportBlob> {
    const result = await relatoriosService.downloadMonthly(params);
    downloadBlob(result.blob, result.filename);
    return result;
  },
  daily(params: DailyReportParams): Promise<unknown> {
    return relatoriosService.getDaily(params);
  },
};
