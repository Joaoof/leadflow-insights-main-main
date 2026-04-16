import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Gauge, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    // Backend ainda não tem /auth/login — login local enquanto autenticação JWT não sobe.
    await new Promise((r) => setTimeout(r, 500));
    login(
      {
        name: email.split("@")[0],
        email,
        role: "admin",
      },
      "local-session"
    );
    toast.success("Bem-vindo!");
    navigate("/");
    setLoading(false);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-ink-950">
      <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-brand-900 via-brand-950 to-ink-950 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-brand-500/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-700 grid place-items-center shadow-glow">
              <Gauge className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">LeadFlow Insights</span>
          </div>
        </div>

        <div className="relative space-y-6">
          <h2 className="text-3xl font-semibold tracking-tight leading-tight">
            Performance real de cada lead,
            <br />
            <span className="text-brand-300">da origem ao fechamento.</span>
          </h2>
          <p className="text-sm text-slate-300 max-w-md">
            Centralize webhooks da Cloudia e da Meta, acompanhe a evolução por etapa
            e descubra quais campanhas realmente convertem.
          </p>
          <ul className="space-y-2 text-sm text-slate-300">
            {[
              "Funil de conversão consolidado",
              "Métricas ao vivo dos atendentes",
              "Alertas de SLA em tempo real",
              "Relatórios PDF automatizados",
            ].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-400" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative text-xs text-slate-500">
          © {new Date().getFullYear()} LeadFlow — Todos os direitos reservados
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
            <p className="text-sm text-slate-400 mt-1">
              Acesse o painel com suas credenciais.
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="label">E-mail</label>
              <div className="mt-1">
                <Input
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  placeholder="voce@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoFocus
                  required
                />
              </div>
            </div>
            <div>
              <label className="label">Senha</label>
              <div className="mt-1">
                <Input
                  type="password"
                  icon={<Lock className="h-4 w-4" />}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full justify-center" loading={loading}>
            Entrar no painel
          </Button>

          <p className="text-[11px] text-slate-500 text-center">
            Sessão local enquanto a autenticação JWT não está no backend.
          </p>
        </form>
      </div>
    </div>
  );
}
