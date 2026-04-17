import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toNumberOrUndef } from "@/api/params";

interface ClinicStore {
  clinicId: number | null;
  /** Normaliza qualquer valor recebido (string/number/vazio) para number|null. */
  setClinicId: (id: number | string | null | undefined) => void;
}

function envClinic(): number | null {
  const raw = import.meta.env.VITE_DEFAULT_CLINIC_ID;
  const n = toNumberOrUndef(raw);
  return n ?? null;
}

export const useClinic = create<ClinicStore>()(
  persist(
    (set) => ({
      clinicId: envClinic(),
      setClinicId: (id) => set({ clinicId: toNumberOrUndef(id) ?? null }),
    }),
    { name: "leadflow.clinic" }
  )
);
