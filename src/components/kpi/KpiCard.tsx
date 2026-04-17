import { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

const toneConfig = {
  neutral: {
    glow:      "bg-slate-400/5",
    icon:      "bg-slate-400/10 text-slate-400",
    bar:       "from-slate-400/0 via-slate-400/60 to-slate-400/0",
    ring:      "ring-slate-400/20",
    label:     "text-slate-400",
    shimmer:   "via-slate-400/10",
  },
  blue: {
    glow:      "bg-blue-500/8",
    icon:      "bg-blue-500/10 text-blue-400",
    bar:       "from-blue-500/0 via-blue-400/70 to-blue-500/0",
    ring:      "ring-blue-400/20",
    label:     "text-blue-400",
    shimmer:   "via-blue-400/10",
  },
  green: {
    glow:      "bg-emerald-500/8",
    icon:      "bg-emerald-500/10 text-emerald-400",
    bar:       "from-emerald-500/0 via-emerald-400/70 to-emerald-500/0",
    ring:      "ring-emerald-400/20",
    label:     "text-emerald-400",
    shimmer:   "via-emerald-400/10",
  },
  amber: {
    glow:      "bg-amber-500/8",
    icon:      "bg-amber-500/10 text-amber-400",
    bar:       "from-amber-500/0 via-amber-400/70 to-amber-500/0",
    ring:      "ring-amber-400/20",
    label:     "text-amber-400",
    shimmer:   "via-amber-400/10",
  },
  red: {
    glow:      "bg-red-500/8",
    icon:      "bg-red-500/10 text-red-400",
    bar:       "from-red-500/0 via-red-400/70 to-red-500/0",
    ring:      "ring-red-400/20",
    label:     "text-red-400",
    shimmer:   "via-red-400/10",
  },
  violet: {
    glow:      "bg-violet-500/8",
    icon:      "bg-violet-500/10 text-violet-400",
    bar:       "from-violet-500/0 via-violet-400/70 to-violet-500/0",
    ring:      "ring-violet-400/20",
    label:     "text-violet-400",
    shimmer:   "via-violet-400/10",
  },
} as const;

export function KpiCard({
  label,
  value,
  icon,
  trend,
  tone = "neutral",
  subtitle,
  loading,
}: {
  label: string;
  value: number | string;
  icon?: ReactNode;
  trend?: number;
  tone?: keyof typeof toneConfig;
  subtitle?: string;
  loading?: boolean;
}) {
  const t = toneConfig[tone];
  const trendUp = trend !== undefined && trend >= 0;

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.03] p-5",
        // ✅ só transform + opacity — compositor do browser, zero reflow
        "transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out",
        "hover:-translate-y-0.5 hover:border-white/10 hover:bg-white/[0.05]",
        "hover:shadow-xl hover:shadow-black/25"
      )}
    >
      {/* Glow hover — só opacity, GPU-friendly */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          t.glow
        )}
      />

      {/* Shimmer sweep no hover — translateX, não width */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full",
          t.shimmer
        )}
      />

      {/* Barra lateral fade */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-y-3 left-0 w-[2px] rounded-full bg-gradient-to-b transition-opacity duration-300 group-hover:opacity-100 opacity-50",
          t.bar
        )}
      />

      <div className="relative flex flex-col gap-3">

        {/* Header: label chamativo + ícone */}
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              // Título mais chamativo: cor do tone + tracking agressivo
              "text-[11px] font-bold uppercase tracking-[0.15em] transition-colors duration-300",
              // Em repouso: apagado; no hover: acende na cor do tone
              "text-slate-500 group-hover:" + t.label.replace("text-", ""),
              t.label.includes("slate") && "group-hover:text-slate-400"
            )}
          >
            {label}
          </span>

          {icon && (
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ring-1",
                // scale no hover — transform, seguro
                "transition-[transform,box-shadow,ring] duration-300 group-hover:scale-110 group-hover:ring-2",
                t.icon,
                t.ring
              )}
            >
              {icon}
            </span>
          )}
        </div>

        {/* Valor principal */}
        <div className="flex items-baseline gap-2.5">
          {loading ? (
            <div className="skeleton h-9 w-28 rounded-lg" />
          ) : (
            <span
              className={cn(
                "text-[2rem] font-black leading-none tracking-tight text-white",
                // Leve scale no valor ao hover — imperceptível mas polido
                "transition-transform duration-300 group-hover:scale-[1.01] origin-left"
              )}
            >
              {typeof value === "number" ? formatNumber(value) : value}
            </span>
          )}

          {trend !== undefined && !loading && (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-bold tabular-nums",
                // fadeIn suave — opacity, seguro
                "transition-[opacity,transform] duration-300 group-hover:opacity-100 opacity-80 group-hover:translate-y-0 translate-y-0.5",
                trendUp
                  ? "bg-emerald-500/10 text-emerald-400"
                  : "bg-red-500/10 text-red-400"
              )}
            >
              {trendUp
                ? <TrendingUp className="h-3 w-3 shrink-0" />
                : <TrendingDown className="h-3 w-3 shrink-0" />
              }
              {trendUp ? "+" : "−"}{Math.abs(trend).toFixed(1)}%
            </span>
          )}
        </div>

        {/* Divisor + Subtítulo */}
        {subtitle && (
          <>
            <div className="h-px bg-white/[0.04] transition-colors duration-300 group-hover:bg-white/[0.08]" />
            <p className="text-[11px] leading-5 text-slate-500 transition-colors duration-300 group-hover:text-slate-400">
              {subtitle}
            </p>
          </>
        )}
      </div>
    </div>
  );
}