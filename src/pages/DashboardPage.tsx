import { Suspense, lazy, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CalendarCheck,
  CalendarX,
  CreditCard,
  DollarSign,
  HeartHandshake,
  Percent,
  Radio,
  Stethoscope,
  TrendingUp,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { KpiCard } from "@/components/kpi/KpiCard";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StateBadge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { webhooksService } from "@/services/webhooks";
import { metricsService } from "@/services/metrics";
import { useClinic } from "@/hooks/useClinic";
import { formatNumber, formatPercent, truncate, formatDate } from "@/lib/utils";
import { DashboardFilters, DashboardFiltersState, defaultFilters } from "@/components/filters/DashboardFilters";

const FunnelChart = lazy(() =>
  import("@/components/charts/FunnelChart").then((module) => ({
    default: module.FunnelChart,
  }))
);
const EvolutionLine = lazy(() =>
  import("@/components/charts/EvolutionLine").then((module) => ({
    default: module.EvolutionLine,
  }))
);
const SourceDonut = lazy(() =>
  import("@/components/charts/SourceDonut").then((module) => ({
    default: module.SourceDonut,
  }))
);

function last6MonthsRange() {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 5);
  start.setDate(1);
  return {
    dataInicio: start.toISOString().slice(0, 10),
    dataFim: end.toISOString().slice(0, 10),
  };
}

export default function DashboardPage() {
  const { tenantId, unitId } = useClinic();
  const range = last6MonthsRange();

  const states = useQuery({
    queryKey: ["count-by-state", unitId],
    queryFn: () => webhooksService.countByState(unitId || undefined),
  });
  const consultas = useQuery({
    queryKey: ["consultas", unitId],
    queryFn: () => webhooksService.consultas(unitId || undefined),
  });
  const comPag = useQuery({
    queryKey: ["com-pagamento", unitId],
    queryFn: () => webhooksService.comPagamento(unitId || undefined),
  });
  const semPag = useQuery({
    queryKey: ["sem-pagamento", unitId],
    queryFn: () => webhooksService.semPagamento(unitId || undefined),
  });
  const etapa = useQuery({
    queryKey: ["etapa-agrupada", unitId],
    queryFn: () => webhooksService.etapaAgrupada(unitId || undefined),
  });
  const origem = useQuery({
    queryKey: ["origem-cloudia", unitId],
    queryFn: () => webhooksService.origemCloudia(unitId || undefined),
  });
  const evolucao = useQuery({
    queryKey: ["evolucao", unitId, range.dataInicio, range.dataFim],
    queryFn: () =>
      webhooksService.buscarInicioFim({ clinicId: unitId || undefined, ...range }),
  });
  const resumoLive = useQuery({
    queryKey: ["live-resumo", unitId],
    queryFn: () => metricsService.resumo(unitId || undefined),
    refetchInterval: 30_000,
  });
  const ativos = useQuery({
    queryKey: ["active", unitId],
    queryFn: () => webhooksService.activeLeads({ limit: 10, unitId: unitId || undefined }),
  });

  const totalLeadQuery = useQuery({
  queryKey: ["/webhooks/total-leads", tenantId],
  queryFn: () => webhooksService.getTotalLeads(tenantId ?? 0),
  enabled: tenantId !== null,
  });

  const [filters, setFilters] = useState<DashboardFiltersState>(defaultFilters);


  const total = totalLeadQuery.data ?? 0;
  const conversao = total > 0 ? ((consultas.data ?? 0) / total) * 100 : 0;
  const pagamentoRate = total > 0 ? ((comPag.data ?? 0) / total) * 100 : 0;

  const donutData = (origem.data ?? []).slice(0, 8).map((o) => ({
    name: o.origem ?? "—",
    value: o.quantidade ?? 0,
  }));

  return (
    <>
        <PageHeader
    title="Visão geral"
    description={
      unitId
        ? `Performance consolidada · unitId: ${unitId}`
        : "Performance consolidada — selecione um Unit ID na topbar para filtrar."
    }
    backgroundImage="https://i.postimg.cc/vH3zxNPf/Gemini-Generated-Image-ksegwnksegwnkseg.png"
      badge="Clínica"
    actions={
      <>
        <Link to="/live">
          <Button
            variant="outline"
            size="sm"
            className="relative border-red-500/60 bg-red-500/10 text-red-400 hover:border-red-400 hover:bg-red-500/20 hover:text-red-300"
          >
            {/* Ping de "ao vivo" */}
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
            </span>
            Ao vivo
          </Button>
        </Link>

        <Link to="/reports">
          <Button size="sm">
            <CalendarCheck className="h-4 w-4" /> Gerar relatório
          </Button>
        </Link>
      </>
    }
  />

      <div className="mb-10">
      <DashboardFilters
      value={filters}
      onChange={setFilters}
      onSearch={() => {
        // React Query refetch automático pelas queryKeys — mas se quiser forçar:
        states.refetch();
        consultas.refetch();
        comPag.refetch();
        semPag.refetch();
        evolucao.refetch();
      }}
      />
      </div>


    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
      {/* ── Linha 1 ── */}
      <KpiCard
        label="Total de leads"
        value={total}
        icon={<Users className="h-5 w-5" />}
        tone="blue"
        loading={totalLeadQuery.isLoading}
      />
      <KpiCard
        label="Em atendimento"
        value={states.data?.service ?? 0}
        icon={<HeartHandshake className="h-5 w-5" />}
        tone="violet"
        loading={states.isLoading}
      />
      <KpiCard
        label="Na fila"
        value={states.data?.queue ?? 0}
        icon={<UserPlus className="h-5 w-5" />}
        tone="amber"
        loading={states.isLoading}
      />
      <KpiCard
        label="Taxa de conversão"
        value={formatPercent(conversao)}
        icon={<Percent className="h-5 w-5" />}
        tone="blue"
        loading={consultas.isLoading || totalLeadQuery.isLoading}
        subtitle={`${formatPercent(pagamentoRate)} pagam na hora`}
      />
      <KpiCard
        label="CAC"
        value="—"
        icon={<DollarSign className="h-5 w-5" />}
        tone="amber"
        subtitle="Custo por aquisição"
      />

      {/* ── Linha 2 ── */}
      <KpiCard
        label="Agend. c/ pagamento"
        value={comPag.data ?? 0}
        icon={<CreditCard className="h-5 w-5" />}
        tone="green"
        loading={comPag.isLoading}
        subtitle="Agendados e pagos"
      />
      <KpiCard
        label="Agend. s/ pagamento"
        value={semPag.data ?? 0}
        icon={<CalendarX className="h-5 w-5" />}
        tone="red"
        loading={semPag.isLoading}
        subtitle="Agendados sem pagar"
      />
      <KpiCard
        label="Em tratamento"
        value={consultas.data ?? 0}
        icon={<Stethoscope className="h-5 w-5" />}
        tone="green"
        loading={consultas.isLoading}
        subtitle="Fechou / tratando"
      />
      <KpiCard
        label="Fecharam"
        value={consultas.data ?? 0}
        icon={<TrendingUp className="h-5 w-5" />}
        tone="violet"
        loading={consultas.isLoading}
        subtitle="Convertidos total"
      />
      <KpiCard
        label="S/ pagamento %"
        value={total > 0 ? formatPercent(((semPag.data ?? 0) / total) * 100) : "—"}
        icon={<AlertTriangle className="h-5 w-5" />}
        tone="amber"
        loading={semPag.isLoading || totalLeadQuery.isLoading}
        subtitle="Taxa sem pagamento"
      />
    </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Funil de conversão"
            subtitle="Da entrada do lead até o tratamento em andamento"
          />
          <CardBody>
            <Suspense fallback={<div className="skeleton h-60 w-full rounded-lg" />}>
              <FunnelChart
                stages={[
                  { label: "Total de leads", count: total, tone: "blue" },
                  {
                    label: "Agendados sem pagamento",
                    count: semPag.data ?? 0,
                    tone: "amber",
                  },
                  {
                    label: "Agendados com pagamento",
                    count: comPag.data ?? 0,
                    tone: "violet",
                  },
                  {
                    label: "Fechou / em tratamento",
                    count: consultas.data ?? 0,
                    tone: "emerald",
                  },
                ]}
              />
            </Suspense>
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Origem dos leads"
            subtitle="Top canais de aquisição"
            action={
              <Link to="/sources">
                <Button variant="ghost" size="sm">Ver tudo</Button>
              </Link>
            }
          />
          <CardBody>
            {origem.isLoading ? (
              <div className="skeleton h-60 w-full rounded-lg" />
            ) : donutData.length ? (
              <Suspense fallback={<div className="skeleton h-60 w-full rounded-lg" />}>
                <SourceDonut data={donutData} />
              </Suspense>
            ) : (
              <EmptyState title="Sem origens registradas" />
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Evolução temporal"
            subtitle="Leads captados nos últimos 6 meses"
            action={
              <Link to="/evolution">
                <Button variant="ghost" size="sm">Ver detalhes</Button>
              </Link>
            }
          />
          <CardBody>
            {evolucao.isLoading ? (
              <div className="skeleton h-60 w-full rounded-lg" />
            ) : (evolucao.data?.length ?? 0) > 0 ? (
              <Suspense fallback={<div className="skeleton h-60 w-full rounded-lg" />}>
                <EvolutionLine data={evolucao.data!} />
              </Suspense>
            ) : (
              <EmptyState title="Sem dados no período" />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Ao vivo" subtitle="Sincronizado da Cloudia" />
          <CardBody className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Em atendimento" value={resumoLive.data?.totalEmAtendimento ?? 0} />
              <MiniStat label="Na fila" value={resumoLive.data?.totalNaFila ?? 0} />
            </div>
            <MiniStat
              label="Tempo médio de fila"
              value={
                resumoLive.data?.tempoMedio
                  ? `${Math.round(resumoLive.data.tempoMedio)} min`
                  : "—"
              }
            />
            <Link to="/live" className="block pt-2">
              <Button variant="outline" className="w-full justify-center" size="sm">
                Abrir painel ao vivo
              </Button>
            </Link>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card>
          <CardHeader
            title="Leads ativos agora"
            subtitle="Últimos leads em andamento"
            action={
              <Link to="/leads">
                <Button variant="ghost" size="sm">Ver todos</Button>
              </Link>
            }
          />
          <CardBody className="p-0">
            <div className="divide-y divide-white/5">
              {ativos.isLoading
                ? Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="p-4 flex items-center gap-3">
                      <div className="skeleton h-9 w-9 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="skeleton h-3 w-40" />
                        <div className="skeleton h-3 w-24" />
                      </div>
                    </div>
                  ))
                : ativos.data?.slice(0, 8).map((l) => (
                    <Link
                      key={l.id}
                      to={`/leads/${l.id}`}
                      className="flex items-center gap-3 p-4 hover:bg-white/[0.04] transition-colors"
                    >
                      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-400 to-violet-600 grid place-items-center text-xs font-semibold">
                        {(l.name ?? "?").charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-100 truncate">
                          {truncate(l.name ?? "Sem nome", 40)}
                        </p>
                        <p className="text-xs text-slate-400 truncate">
                          {l.phone ?? "—"} · {formatDate(l.updatedAt ?? l.createdAt)}
                        </p>
                      </div>
                      <StateBadge state={l.conversationState ?? undefined} />
                    </Link>
                  ))}
            </div>
            {!ativos.isLoading && !ativos.data?.length && (
              <EmptyState title="Nenhum lead ativo" />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title="Distribuição por etapa"
            subtitle="Momento atual dos leads"
            action={
              <Link to="/funnel">
                <Button variant="ghost" size="sm">Analisar</Button>
              </Link>
            }
          />
          <CardBody>
            {etapa.isLoading ? (
              <div className="skeleton h-60 w-full rounded-lg" />
            ) : (etapa.data?.length ?? 0) > 0 ? (
              <div className="space-y-2">
                {etapa.data!
                  .slice()
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 8)
                  .map((e) => {
                    const max = Math.max(1, ...etapa.data!.map((x) => x.count));
                    const pct = (e.count / max) * 100;
                    return (
                      <div key={e.stage}>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-300 truncate">
                            {e.stage.replace(/_/g, " ")}
                          </span>
                          <span className="font-semibold text-slate-100">
                            {formatNumber(e.count)}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-brand-500 to-violet-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            ) : (
              <EmptyState
                title="Sem etapas para exibir"
                icon={<AlertTriangle className="h-5 w-5 text-amber-400" />}
              />
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3">
      <div className="label">{label}</div>
      <div className="text-xl font-semibold text-slate-50 mt-1">
        {typeof value === "number" ? formatNumber(value) : value}
      </div>
    </div>
  );
}
