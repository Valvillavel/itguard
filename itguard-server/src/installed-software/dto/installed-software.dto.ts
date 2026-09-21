export interface CreateInstalledSoftwareDTO {
  assetId: number;
  softwareId: number;
  version?: string;
  installedAt?: string | Date;
  status?: string;
}

export interface UpdateInstalledSoftwareDTO {
  version?: string;
  lastCheck?: string | Date;
  status?: string;
}
