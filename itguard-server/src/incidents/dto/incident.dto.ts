import type { IncidentPriority, IncidentStatus } from '@prisma/client';

export interface CreateIncidentDTO {
  ticketNumber: string;
  type: string;
  description: string;
  assetId?: number;
  userId?: string;
  responsibleId?: string;
  priority?: IncidentPriority;
}

export interface UpdateIncidentDTO {
  type?: string;
  priority?: IncidentPriority;
  status?: IncidentStatus;
  description?: string;
  diagnosis?: string;
  solution?: string;
  responsibleId?: string;
  closedAt?: string | Date;
}
