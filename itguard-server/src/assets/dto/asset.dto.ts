import type { AssetStatus } from '@prisma/client';

export interface CreateAssetDTO {
  inventoryCode: string;
  name: string;
  type: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  operatingSystem?: string;
  osVersion?: string;
  osBuild?: string;
  architecture?: string;
  ipAddress?: string;
  macAddress?: string;
  location?: string;
  acquisitionDate?: string | Date;
  warrantyExpiration?: string | Date;
  assignmentDate?: string | Date;
  status?: AssetStatus;
  userId?: string;
  departmentId?: number;
  observations?: string;
}

export interface UpdateAssetDTO {
  name?: string;
  type?: string;
  brand?: string;
  model?: string;
  serialNumber?: string;
  operatingSystem?: string;
  osVersion?: string;
  osBuild?: string;
  architecture?: string;
  ipAddress?: string;
  macAddress?: string;
  location?: string;
  acquisitionDate?: string | Date;
  warrantyExpiration?: string | Date;
  observations?: string;
}

export interface ChangeAssetStatusDTO {
  status: AssetStatus;
}

export interface AssignUserDTO {
  userId: string | null;
}

export interface AssignDepartmentDTO {
  departmentId: number | null;
}
