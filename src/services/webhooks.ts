/**
 * Webhooks API — aderente ao grupo "Webhooks" do OpenAPI.
 *
 * Observações do contrato:
 *  - GET /webhooks não aceita query params. A filtragem aqui é
 *    client-side em cima do retorno cru.
 *  - GET /webhooks/buscar-inicio-fim espera `date-time` (ISO).
 *  - GET /webhooks/consulta-periodos usa PascalCase:
 *      ClinicId, Ano, Mes, Semana (double), Dia.
 *  - GET /webhooks/active retorna `ActiveLeadDto[]` (schema do contrato).
 *  - GET /webhooks/count-by-state retorna `LeadsCountDto` (schema do contrato).
 */

import { api } from "@/lib/api";
import {
  extractCountFromResponse,
  normalizeActiveLeadList,
  normalizeGroupCount,
  normalizeLeadsCount,
  normalizeOrigemAgrupada,
  normalizePeriodSeries,
  normalizeWebhookLeadList,
} from "@/adapters/normalize";
import { cleanParams, toIsoDateTime, toNumberOrUndef } from "@/api/params";
import type {
  ActiveLeadDto,
  ActiveLeadsParams,
  BuscarInicioFimParams,
  ConsultaPeriodosParams,
  GroupCountDto,
  LeadsCountDto,
  OrigemAgrupadaDto,
  PeriodPointDto,
  WebhookLead,
} from "@/api/types";

export const webhooksService = {
  /**
   * GET /webhooks — lista bruta dos leads persistidos.
   * OBSOLETO para consumo em larga escala: sem paginação/filtro.
   * TODO backend: expor `GET /webhooks?unitId=&state=&page=&pageSize=`.
   */
  async listAllLeads(): Promise<WebhookLead[]> {
    const { data } = await api.get<unknown>("/webhooks");
    return normalizeWebhookLeadList(data);
  },

  /** GET /webhooks/consultas?clinicId= */
  async getConsultasCount(clinicId?: number): Promise<number> {
    const { data } = await api.get<unknown>("/webhooks/consultas", {
      params: cleanParams({ clinicId }),
    });
    return extractCountFromResponse(data);
  },

  /** GET /webhooks/sem-pagamento?clinicId= */
  async getWithoutPaymentCount(clinicId?: number): Promise<number> {
    const { data } = await api.get<unknown>("/webhooks/sem-pagamento", {
      params: cleanParams({ clinicId }),
    });
    return extractCountFromResponse(data);
  },

  /** GET /webhooks/com-pagamento?clinicId= */
  async getWithPaymentCount(clinicId?: number): Promise<number> {
    const { data } = await api.get<unknown>("/webhooks/com-pagamento", {
      params: cleanParams({ clinicId }),
    });
    return extractCountFromResponse(data);
  },

  /** GET /webhooks/source-final?clinicId= */
  async getSourceFinal(clinicId?: number): Promise<GroupCountDto[]> {
    const { data } = await api.get<unknown>("/webhooks/source-final", {
      params: cleanParams({ clinicId }),
    });
    return normalizeGroupCount(data, "source");
  },

  /** GET /webhooks/origem-cloudia?clinicId= */
  async getOrigemCloudia(clinicId?: number): Promise<OrigemAgrupadaDto[]> {
    const { data } = await api.get<unknown>("/webhooks/origem-cloudia", {
      params: cleanParams({ clinicId }),
    });
    return normalizeOrigemAgrupada(data);
  },

  /** GET /webhooks/fim-de-semana?clinicId= */
  async getWeekendLeads(clinicId?: number): Promise<WebhookLead[]> {
    const { data } = await api.get<unknown>("/webhooks/fim-de-semana", {
      params: cleanParams({ clinicId }),
    });
    return normalizeWebhookLeadList(data);
  },

  /** GET /webhooks/etapa-agrupada?clinicId= */
  async getStageGrouped(clinicId?: number): Promise<GroupCountDto[]> {
    const { data } = await api.get<unknown>("/webhooks/etapa-agrupada", {
      params: cleanParams({ clinicId }),
    });
    return normalizeGroupCount(data, "stage");
  },

  /** GET /webhooks/buscar-inicio-fim?clinicId=&dataInicio=&dataFim=
   *  Datas convertidas para ISO date-time como exige o contrato. */
  async getRangeSeries(params: BuscarInicioFimParams): Promise<PeriodPointDto[]> {
    const { data } = await api.get<unknown>("/webhooks/buscar-inicio-fim", {
      params: cleanParams({
        clinicId: params.clinicId,
        dataInicio: toIsoDateTime(params.dataInicio),
        dataFim: toIsoDateTime(params.dataFim),
      }),
    });
    return normalizePeriodSeries(data);
  },

  /**
   * GET /webhooks/consulta-periodos
   * Contrato usa **PascalCase** nos query params.
   */
  async getPeriodBuckets(
    params: ConsultaPeriodosParams
  ): Promise<PeriodPointDto[]> {
    const { data } = await api.get<unknown>("/webhooks/consulta-periodos", {
      params: cleanParams({
        ClinicId: params.ClinicId,
        Ano: params.Ano,
        Mes: params.Mes,
        Semana: params.Semana,
        Dia: params.Dia,
      }),
    });
    return normalizePeriodSeries(data);
  },

  /** GET /webhooks/active?limit=&unitId= — retorno tipado pelo contrato. */
  async getActiveLeads(params: ActiveLeadsParams = {}): Promise<ActiveLeadDto[]> {
    const { data } = await api.get<unknown>("/webhooks/active", {
      params: cleanParams({ limit: params.limit, unitId: params.unitId }),
    });
    return normalizeActiveLeadList(data);
  },

  /** GET /webhooks/count-by-state?unitId= — `LeadsCountDto`. */
  async getCountByState(unitId?: number): Promise<LeadsCountDto> {
    const { data } = await api.get<unknown>("/webhooks/count-by-state", {
      params: cleanParams({ unitId }),
    });
    return normalizeLeadsCount(data);
  },

  /** GET /webhooks/sync/health */
  async getSyncHealth(): Promise<unknown> {
    const { data } = await api.get<unknown>("/webhooks/sync/health");
    return data;
  },

  // ── Compat aliases (nomes usados pelas páginas existentes) ─────────
  /** Alias legado de {@link getConsultasCount}. */
  consultas(clinicId?: number | string | null): Promise<number> {
    return this.getConsultasCount(toNumberOrUndef(clinicId));
  },
  /** Alias legado de {@link getWithPaymentCount}. */
  comPagamento(clinicId?: number | string | null): Promise<number> {
    return this.getWithPaymentCount(toNumberOrUndef(clinicId));
  },
  /** Alias legado de {@link getWithoutPaymentCount}. */
  semPagamento(clinicId?: number | string | null): Promise<number> {
    return this.getWithoutPaymentCount(toNumberOrUndef(clinicId));
  },
  /** Alias legado de {@link getSourceFinal}. */
  sourceFinal(clinicId?: number | string | null): Promise<GroupCountDto[]> {
    return this.getSourceFinal(toNumberOrUndef(clinicId));
  },
  /** Alias legado de {@link getOrigemCloudia}. */
  origemCloudia(
    clinicId?: number | string | null
  ): Promise<OrigemAgrupadaDto[]> {
    return this.getOrigemCloudia(toNumberOrUndef(clinicId));
  },
  /** Alias legado de {@link getStageGrouped}. */
  etapaAgrupada(clinicId?: number | string | null): Promise<GroupCountDto[]> {
    return this.getStageGrouped(toNumberOrUndef(clinicId));
  },
  /** Alias legado de {@link getRangeSeries}. */
  buscarInicioFim(
    params: {
      clinicId?: number | string | null;
      dataInicio: string;
      dataFim: string;
    }
  ): Promise<PeriodPointDto[]> {
    return this.getRangeSeries({
      clinicId: toNumberOrUndef(params.clinicId),
      dataInicio: params.dataInicio,
      dataFim: params.dataFim,
    });
  },
  /** Alias legado de {@link getActiveLeads}. */
  activeLeads(params: ActiveLeadsParams = {}): Promise<ActiveLeadDto[]> {
    return this.getActiveLeads(params);
  },
  /** Alias legado de {@link getCountByState}. */
  countByState(unitId?: number | string | null): Promise<LeadsCountDto> {
    return this.getCountByState(toNumberOrUndef(unitId));
  },
  /** Alias legado de {@link listAllLeads} — aceita filtro client-side
   *  opcional por clinicId, já que o backend não suporta query params. */
  async listLeads(
    params: { clinicId?: number | string | null } = {}
  ): Promise<WebhookLead[]> {
    const all = await this.listAllLeads();
    const clinicId = toNumberOrUndef(params.clinicId);
    return clinicId === undefined
      ? all
      : all.filter((l) => l.clinicId === clinicId);
  },
};
