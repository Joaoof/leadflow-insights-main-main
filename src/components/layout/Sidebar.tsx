import { NavLink } from "react-router-dom";
import {
  BarChart3,
  Bell,
  Building2,
  Cog,
  FileBarChart,
  Filter,
  Gauge,
  LayoutDashboard,
  LineChart,
  ListChecks,
  Radio,
  Users2,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/leads", label: "Leads", icon: ListChecks },
  { to: "/funnel", label: "Funil", icon: Workflow },
  { to: "/sources", label: "Origens", icon: Filter },
  { to: "/evolution", label: "Evolução", icon: LineChart },
  { to: "/live", label: "Ao vivo", icon: Radio },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/alerts", label: "Alertas", icon: Bell },
  { to: "/attendants", label: "Atendentes", icon: Users2 },
  { to: "/units", label: "Unidades", icon: Building2 },
  { to: "/reports", label: "Relatórios", icon: FileBarChart },
  { to: "/settings", label: "Configurações", icon: Cog },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-white/10 bg-ink-950/60 backdrop-blur-xl">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-white/10">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 grid place-items-center shadow-glow">
          <Gauge className="h-4 w-4 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-semibold text-slate-50">LeadFlow</div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400">
            Insights · v1.0
          </div>
        </div>
      </div>

      <nav className="p-3 space-y-0.5 overflow-y-auto flex-1">
        {nav.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-brand-500/15 text-brand-200 ring-1 ring-inset ring-brand-500/30"
                  : "text-slate-300 hover:bg-white/5"
              )
            }
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <div className="rounded-lg bg-gradient-to-br from-brand-500/10 to-violet-500/10 p-3 border border-white/5">
          <p className="text-xs font-medium text-slate-200">Dica pro</p>
          <p className="mt-1 text-[11px] text-slate-400">
            Use filtros por intervalo para cruzar conversão e origem em tempo real.
          </p>
        </div>
      </div>
    </aside>
  );
}
