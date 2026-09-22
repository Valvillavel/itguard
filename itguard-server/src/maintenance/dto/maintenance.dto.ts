import {
  IsInt, IsString, IsOptional, IsEnum, IsNumber,
  IsDateString, IsPositive, Min, MaxLength,
} from 'class-validator';
import { MaintenanceType, MaintenanceStatus } from '@prisma/client';

export class CreateMaintenanceDTO {
  @IsInt({ message: 'assetId debe ser un entero' })
  @IsPositive()
  assetId: number;

  @IsEnum(MaintenanceType, { message: 'Tipo de mantenimiento inválido' })
  type: MaintenanceType;

  @IsDateString({}, { message: 'La fecha debe estar en formato ISO 8601' })
  date: string;

  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsString() @MaxLength(200) technician?: string;
  @IsOptional() @IsString() @MaxLength(200) provider?: string;
  @IsOptional() @IsNumber() @Min(0) cost?: number;
  @IsOptional() @IsString() @MaxLength(500) observations?: string;
}

export class UpdateMaintenanceDTO {
  @IsOptional() @IsEnum(MaintenanceType) type?: MaintenanceType;

  @IsOptional()
  @IsEnum(MaintenanceStatus, { message: 'Estado de mantenimiento inválido' })
  status?: MaintenanceStatus;

  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsString() @MaxLength(500) diagnosis?: string;
  @IsOptional() @IsString() @MaxLength(500) workDone?: string;
  @IsOptional() @IsString() @MaxLength(200) technician?: string;
  @IsOptional() @IsString() @MaxLength(200) provider?: string;
  @IsOptional() @IsNumber() @Min(0) cost?: number;
  @IsOptional() @IsString() @MaxLength(500) result?: string;
  @IsOptional() @IsString() @MaxLength(500) observations?: string;
}
