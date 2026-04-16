import { api } from "@/lib/api";

export const configService = {
  async setCloudiaKey(payload: { apiKey: string; expiresAt?: string }) {
    const { data } = await api.post("/api/config/cloudia-api-key", payload);
    return data;
  },
  async status(): Promise<{ configured: boolean; expiresAt?: string | null }> {
    const { data } = await api.get("/api/config/cloudia-api-key/status");
    return data;
  },
  async remove() {
    const { data } = await api.delete("/api/config/cloudia-api-key");
    return data;
  },
};
