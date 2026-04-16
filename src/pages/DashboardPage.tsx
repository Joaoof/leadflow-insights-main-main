import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  CalendarCheck,
  CreditCard,
  HeartHandshake,
  Percent,
  Radio,
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
import { FunnelChart } from "@/components/charts/FunnelChart";
import { EvolutionLine } from "@/components/charts/EvolutionLine";
import { SourceDonut } from "@/components/charts/SourceDonut";
import { webhooksService } from "@/services/webhooks";
import { metricsService } from "@/services/metrics";
import { useClinic } from "@/hooks/useClinic";
import { formatNumber, formatPercent, truncate, formatDate } from "@/lib/utils";

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

export function DashboardPage() {
  const { clinicId } = useClinic();
  const range = last6MonthsRange();

  const states = useQuery({
    queryKey: ["count-by-state", clinicId],
    queryFn: () => webhooksService.countByState(clinicId || undefined),
  });
  const consultas = useQuery({
    queryKey: ["consultas", clinicId],
    queryFn: () => webhooksService.consultas(clinicId || undefined),
  });
  const comPag = useQuery({
    queryKey: ["com-pagamento", clinicId],
    queryFn: () => webhooksService.comPagamento(clinicId || undefined),
  });
  const semPag = useQuery({
    queryKey: ["sem-pagamento", clinicId],
    queryFn: () => webhooksService.semPagamento(clinicId || undefined),
  });
  const etapa = useQuery({
    queryKey: ["etapa-agrupada", clinicId],
    queryFn: () => webhooksService.etapaAgrupada(clinicId || undefined),
  });
  const origem = useQuery({
    queryKey: ["origem-cloudia", clinicId],
    queryFn: () => webhooksService.origemCloudia(clinicId || undefined),
  });
  const evolucao = useQuery({
    queryKey: ["evolucao", clinicId, range.dataInicio, range.dataFim],
    queryFn: () =>
      webhooksService.buscarInicioFim({ clinicId: clinicId || undefined, ...range }),
  });
  const resumoLive = useQuery({
    queryKey: ["live-resumo", clinicId],
    queryFn: () => metricsService.resumo(clinicId || undefined),
    refetchInterval: 30_000,
  });
  const ativos = useQuery({
    queryKey: ["active", clinicId],
    queryFn: () => webhooksService.activeLeads({ limit: 10 }),
  });

  const total = states.data?.total ?? 0;
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
          clinicId
            ? `Performance consolidada · clinicId: ${clinicId}`
            : "Performance consolidada — selecione um Clinic ID na topbar para filtrar."
        }
        actions={
          <>
            <Link to="/live">
              <Button variant="outline" size="sm">
                <Radio className="h-4 w-4" /> Ao vivo
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

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard
          label="Total de leads"
          value={total}
          icon={<Users className="h-5 w-5" />}
          tone="blue"
          loading={states.isLoading}
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
          label="Com pagamento"
          value={comPag.data ?? 0}
          icon={<CreditCard className="h-5 w-5" />}
          tone="green"
          loading={comPag.isLoading}
        />
        <KpiCard
          label="Fechou / Tratamento"
          value={consultas.data ?? 0}
          icon={<TrendingUp className="h-5 w-5" />}
          tone="green"
          loading={consultas.isLoading}
        />
        <KpiCard
          label="Taxa de conversão"
          value={formatPercent(conversao)}
          icon={<Percent className="h-5 w-5" />}
          tone="blue"
          loading={consultas.isLoading || states.isLoading}
          subtitle={`${formatPercent(pagamentoRate)} pagam na hora`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="lg:col-span-2">
          <CardHeader
            title="Funil de conversão"
            subtitle="Da entrada do lead até o tratamento em andamento"
          />
          <CardBody>
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
              <SourceDonut data={donutData} />
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
              <EvolutionLine data={evolucao.data!} />
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
