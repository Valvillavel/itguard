import type { LicenseStatus } from '@prisma/client';

export interface CreateLicenseDTO {
  softwareId: number;
  licenseType: string;
  purchasedQuantity: number;
  reference?: string;
  purchaseDate?: string | Date;
  activationDate?: string | Date;
  expirationDate?: string | Date;
  provider?: string;
  cost?: number;
  observations?: string;
}

export interface UpdateLicenseDTO {
  licenseType?: string;
  purchasedQuantity?: number;
  usedQuantity?: number;
  reference?: string;
  purchaseDate?: string | Date;
  activationDate?: string | Date;
  expirationDate?: string | Date;
  provider?: string;
  cost?: number;
  status?: LicenseStatus;
  observations?: string;
}
