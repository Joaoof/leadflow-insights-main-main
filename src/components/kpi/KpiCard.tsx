import { ReactNode } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn, formatNumber } from "@/lib/utils";

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
  tone?: "neutral" | "blue" | "green" | "amber" | "red" | "violet";
  subtitle?: string;
  loading?: boolean;
}) {
  const tones = {
    neutral: "from-slate-500/10 text-slate-300",
    blue: "from-brand-500/15 text-brand-300",
    green: "from-emerald-500/15 text-emerald-300",
    amber: "from-amber-500/15 text-amber-300",
    red: "from-red-500/15 text-red-300",
    violet: "from-violet-500/15 text-violet-300",
  } as const;

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] p-5 shadow-card">
      <div
        aria-hidden
        className={cn("absolute inset-0 bg-gradient-to-br to-transparent opacity-70", tones[tone].split(" ")[0])}
      />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="label">{label}</span>
          {icon && <div className={cn("text-lg", tones[tone].split(" ")[1])}>{icon}</div>}
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          {loading ? (
            <div className="skeleton h-8 w-24 rounded" />
          ) : (
            <div className="text-3xl font-semibold text-slate-50 tracking-tight">
              {typeof value === "number" ? formatNumber(value) : value}
            </div>
          )}
          {trend !== undefined && (
            <span
              className={cn(
                "chip",
                trend >= 0
                  ? "bg-emerald-500/15 text-emerald-300"
                  : "bg-red-500/15 text-red-300"
              )}
            >
              {trend >= 0 ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(trend).toFixed(1)}%
            </span>
          )}
        </div>
        {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}
