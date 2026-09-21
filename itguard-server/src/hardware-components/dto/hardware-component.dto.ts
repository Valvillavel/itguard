export interface CreateHardwareComponentDTO {
  assetId: number;
  type: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  capacity?: string;
  status?: string;
  installationDate?: string | Date;
  removalDate?: string | Date;
  observations?: string;
}

export interface UpdateHardwareComponentDTO {
  type?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  capacity?: string;
  status?: string;
  installationDate?: string | Date;
  removalDate?: string | Date;
  observations?: string;
}
