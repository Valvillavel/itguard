import {
  IsString, IsOptional, IsEnum, IsInt, IsUUID,
  IsPositive, IsDateString, MaxLength, MinLength,
} from 'class-validator';
import { IncidentPriority, IncidentStatus } from '@prisma/client';

export class CreateIncidentDTO {
  @IsString({ message: 'El número de ticket es requerido' })
  @MinLength(1)
  @MaxLength(50)
  ticketNumber: string;

  @IsString({ message: 'El tipo es requerido' })
  @MinLength(2)
  @MaxLength(100)
  type: string;

  @IsString({ message: 'La descripción es requerida' })
  @MinLength(5)
  description: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  assetId?: number;

  @IsOptional()
  @IsUUID('4', { message: 'userId debe ser un UUID válido' })
  userId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'responsibleId debe ser un UUID válido' })
  responsibleId?: string;

  @IsOptional()
  @IsEnum(IncidentPriority, { message: 'Prioridad inválida' })
  priority?: IncidentPriority;
}

export class UpdateIncidentDTO {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(100) type?: string;

  @IsOptional()
  @IsEnum(IncidentPriority, { message: 'Prioridad inválida' })
  priority?: IncidentPriority;

  @IsOptional()
  @IsEnum(IncidentStatus, { message: 'Estado de incidente inválido' })
  status?: IncidentStatus;

  @IsOptional() @IsString() @MinLength(5) description?: string;
  @IsOptional() @IsString() @MaxLength(1000) diagnosis?: string;
  @IsOptional() @IsString() @MaxLength(1000) solution?: string;

  @IsOptional()
  @IsUUID('4')
  responsibleId?: string;

  @IsOptional()
  @IsDateString()
  closedAt?: string;
}
