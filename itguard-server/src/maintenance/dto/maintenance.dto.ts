import type { MaintenanceStatus, MaintenanceType } from '@prisma/client';

export interface CreateMaintenanceDTO {
  assetId: number;
  type: MaintenanceType;
  date: string | Date;
  description?: string;
  technician?: string;
  provider?: string;
  cost?: number;
  observations?: string;
}

export interface UpdateMaintenanceDTO {
  type?: MaintenanceType;
  status?: MaintenanceStatus;
  date?: string | Date;
  description?: string;
  diagnosis?: string;
  workDone?: string;
  technician?: string;
  provider?: string;
  cost?: number;
  result?: string;
  observations?: string;
}
