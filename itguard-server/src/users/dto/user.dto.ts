import type { UserStatus } from '@prisma/client';

export interface CreateUserDTO {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
  phone?: string;
  position?: string;
  roleId?: number;
  departmentId?: number;
}

export interface UpdateUserDTO {
  firstName?: string;
  lastName?: string;
  username?: string;
  phone?: string;
  position?: string;
  status?: UserStatus;
  roleId?: number;
  departmentId?: number;
}
