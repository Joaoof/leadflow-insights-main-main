/**
 * Compat shim — mantém a API antiga (SettingsPage). Delega ao service
 * oficial `configurationService`.
 */

import { configurationService } from "@/services/configuration";
import type { CloudiaKeyStatusDto, SetApiKeyRequest } from "@/api/types";

export const configService = {
  setCloudiaKey(payload: SetApiKeyRequest): Promise<void> {
    return configurationService.setCloudiaKey(payload);
  },
  status(): Promise<CloudiaKeyStatusDto> {
    return configurationService.getCloudiaStatus();
  },
  remove(): Promise<void> {
    return configurationService.deleteCloudiaKey();
  },
};
