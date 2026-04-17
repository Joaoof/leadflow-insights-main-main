import { LogOut, RefreshCw, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useClinic } from "@/hooks/useClinic";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

export function Topbar() {
  const { user, logout } = useAuth();
  const { clinicId, setClinicId } = useClinic();
  const qc = useQueryClient();
  const navigate = useNavigate();

  return (
    <header className="h-16 sticky top-0 z-20 flex items-center gap-3 px-4 lg:px-6 border-b border-white/10 bg-ink-950/80 backdrop-blur-xl">
      <div className="flex-1 max-w-xl">
        <Input
          icon={<Search className="h-4 w-4" />}
          placeholder="Buscar leads por nome, telefone ou id..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const v = (e.target as HTMLInputElement).value;
              navigate(`/leads?search=${encodeURIComponent(v)}`);
            }
          }}
        />
      </div>

      <div className="hidden md:flex items-center gap-2">
        <span className="text-xs text-slate-400 whitespace-nowrap">Clinic ID</span>
        <Input
          className="w-44"
          placeholder="clinic-id"
          value={clinicId ?? ""}
          onChange={(e) => setClinicId(e.target.value)}
        />
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => qc.invalidateQueries()}
        title="Recarregar dados"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>

      <div className="h-8 w-px bg-white/10" />

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end leading-tight">
          <span className="text-sm text-slate-100">{user?.name ?? "Convidado"}</span>
          <span className="text-[11px] text-slate-400">{user?.email ?? "local"}</span>
        </div>
        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-brand-400 to-violet-600 grid place-items-center text-white text-sm font-semibold">
          {(user?.name ?? "C").charAt(0).toUpperCase()}
        </div>
        <Button variant="ghost" size="sm" onClick={logout} title="Sair">
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
