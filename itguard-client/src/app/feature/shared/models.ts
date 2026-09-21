export type UserStatus = 'ACTIVO' | 'INACTIVO';
export type AssetStatus =
  | 'VIGENTE'
  | 'REQUIERE_ATENCION'
  | 'LIMITADO'
  | 'LEGACY'
  | 'BAJA'
  | 'EN_REPARACION'
  | 'EN_ALMACEN';
export type LicenseStatus = 'ACTIVA' | 'VENCIDA' | 'SUSPENDIDA' | 'DISPONIBLE';
export type MaintenanceType =
  | 'PREVENTIVO'
  | 'CORRECTIVO'
  | 'ACTUALIZACION'
  | 'REEMPLAZO'
  | 'LIMPIEZA'
  | 'DIAGNOSTICO';
export type MaintenanceStatus = 'PENDIENTE' | 'EN_PROCESO' | 'COMPLETADO' | 'CANCELADO';
export type IncidentStatus = 'ABIERTO' | 'EN_REVISION' | 'EN_ESPERA' | 'RESUELTO' | 'CERRADO';
export type IncidentPriority = 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA';

export interface Role {
  id: number;
  name: string;
  description?: string | null;
}

export interface Department {
  id: number;
  name: string;
  description?: string | null;
  active: boolean;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string | null;
  phone?: string | null;
  position?: string | null;
  status: UserStatus;
  roleId?: number | null;
  departmentId?: number | null;
  role?: Role | null;
  department?: Department | null;
  createdAt: string;
  updatedAt: string;
}

export interface Asset {
  id: number;
  inventoryCode: string;
  name: string;
  type: string;
  brand?: string | null;
  model?: string | null;
  serialNumber?: string | null;
  status: AssetStatus;
  userId?: string | null;
  departmentId?: number | null;
  user?: Pick<User, 'id' | 'firstName' | 'lastName' | 'email'> | null;
  department?: Pick<Department, 'id' | 'name'> | null;
  createdAt: string;
  updatedAt: string;
}

export interface Incident {
  id: number;
  ticketNumber: string;
  type: string;
  priority: IncidentPriority;
  status: IncidentStatus;
  description: string;
  assetId?: number | null;
  userId?: string | null;
  responsibleId?: string | null;
  openedAt: string;
  closedAt?: string | null;
}

export interface Maintenance {
  id: number;
  assetId: number;
  type: MaintenanceType;
  status: MaintenanceStatus;
  date: string;
  description?: string | null;
  technician?: string | null;
}

export interface UpdateUserPayload {
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  position?: string;
  status?: UserStatus;
  roleId?: number;
  departmentId?: number;
}
