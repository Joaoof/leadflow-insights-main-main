import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Building2, LogOut, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { unitsService } from "@/services/units";
import { Card, CardBody, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useClinic } from "@/hooks/useClinic";
import { useAuth } from "@/hooks/useAuth";

const fallbackUnits = [
  { id: "araguaina", clinicId: "8020", name: "Doutor Hérnia Unidade Araguaína" },
  { id: "maraba", clinicId: "8021", name: "Doutor Hérnia Unidade Marabá" },
  { id: "parauapebas", clinicId: "8022", name: "Doutor Hérnia Unidade Parauapebas" },
  { id: "imperatriz", clinicId: "8023", name: "Doutor Hérnia Imperatriz" },
  { id: "canaa", clinicId: "8024", name: "Doutor Hérnia Canaã" },
  { id: "balsas", clinicId: "8025", name: "Doutor Hérnia Balsas" },
];

export function UnitSelectPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { clinicId, setClinicId } = useClinic();
  const [search, setSearch] = useState("");

  const units = useQuery({
    queryKey: ["units", "selector"],
    queryFn: () => unitsService.list(),
    retry: false,
  });

  const options = useMemo(() => {
    const fromApi = (units.data ?? []).map((unit) => ({
      id: unit.id,
      clinicId: unit.clinicId,
      name: unit.name?.trim() || `Unidade ${unit.clinicId}`,
    }));

    const combined = fromApi.length ? fromApi : fallbackUnits;
    return combined.filter((item) => {
      const normalized = `${item.name} ${item.clinicId}`.toLowerCase();
      return normalized.includes(search.toLowerCase());
    });
  }, [search, units.data]);

  return (
    <div className="min-h-screen bg-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white shadow-xl border border-slate-200 p-6 md:p-10">
        <div className="flex items-center justify-end">
          <Button variant="ghost" onClick={logout}>
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>

        <div className="mt-4 text-center">
          <h1 className="text-3xl font-semibold text-slate-800">Escolha uma unidade</h1>
          <p className="text-sm text-slate-500 mt-2">
            Selecione a unidade para puxar os dados corretos no painel.
          </p>
        </div>

        <div className="mx-auto mt-6 max-w-md">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search className="h-4 w-4" />}
            placeholder="Pesquisar unidade ou clinic ID"
          />
        </div>

        <Card className="mt-8 border-slate-200 bg-slate-50/70">
          <CardHeader
            title="Unidade ativa"
            subtitle={clinicId ? `Clinic ID selecionado: ${clinicId}` : "Nenhuma unidade selecionada"}
          />
          <CardBody>
            <p className="text-sm text-slate-500">
              A unidade padrão já começa com <strong>Araguaína (ID 8020)</strong>.
            </p>
          </CardBody>
        </Card>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {options.map((unit) => (
            <button
              key={unit.id}
              onClick={() => {
                setClinicId(String(unit.clinicId));
                navigate("/");
              }}
              className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="h-20 w-20 rounded-full border-2 border-brand-700/20 grid place-items-center text-brand-700 bg-brand-50">
                <Building2 className="h-8 w-8" />
              </div>
              <p className="mt-5 text-base font-semibold text-slate-800 leading-snug">{unit.name}</p>
              <p className="mt-1 text-xs font-mono text-slate-500">Clinic ID: {unit.clinicId}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
