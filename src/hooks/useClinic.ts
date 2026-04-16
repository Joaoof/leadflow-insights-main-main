import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ClinicStore {
  clinicId: string;
  setClinicId: (id: string) => void;
}

export const useClinic = create<ClinicStore>()(
  persist(
    (set) => ({
      clinicId: import.meta.env.VITE_DEFAULT_CLINIC_ID ?? "",
      setClinicId: (id) => set({ clinicId: id }),
    }),
    { name: "leadflow.clinic" }
  )
);
