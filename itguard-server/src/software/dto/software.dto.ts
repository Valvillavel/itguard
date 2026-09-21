export interface CreateSoftwareDTO {
  name: string;
  manufacturer?: string;
  category?: string;
  currentVersion?: string;
  requiresLicense?: boolean;
  active?: boolean;
}

export interface UpdateSoftwareDTO {
  name?: string;
  manufacturer?: string;
  category?: string;
  currentVersion?: string;
  requiresLicense?: boolean;
  active?: boolean;
}
