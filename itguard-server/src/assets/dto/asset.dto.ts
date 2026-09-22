import {
  IsString, IsOptional, IsEnum, IsInt, IsUUID,
  IsDateString, IsNumber, IsPositive, MinLength, MaxLength,
} from 'class-validator';
import { AssetStatus } from '@prisma/client';

export class CreateAssetDTO {
  @IsString()
  @MinLength(1, { message: 'El código de inventario es requerido' })
  @MaxLength(50)
  inventoryCode: string;

  @IsString()
  @MinLength(2, { message: 'El nombre es requerido' })
  @MaxLength(150)
  name: string;

  @IsString()
  @MinLength(2, { message: 'El tipo es requerido' })
  type: string;

  @IsOptional() @IsString() @MaxLength(100) brand?: string;
  @IsOptional() @IsString() @MaxLength(100) model?: string;
  @IsOptional() @IsString() @MaxLength(100) serialNumber?: string;
  @IsOptional() @IsString() @MaxLength(100) operatingSystem?: string;
  @IsOptional() @IsString() @MaxLength(50) osVersion?: string;
  @IsOptional() @IsString() @MaxLength(50) osBuild?: string;
  @IsOptional() @IsString() @MaxLength(20) architecture?: string;
  @IsOptional() @IsString() @MaxLength(45) ipAddress?: string;
  @IsOptional() @IsString() @MaxLength(17) macAddress?: string;
  @IsOptional() @IsString() @MaxLength(200) location?: string;
  @IsOptional() @IsDateString() acquisitionDate?: string;
  @IsOptional() @IsDateString() warrantyExpiration?: string;
  @IsOptional() @IsDateString() assignmentDate?: string;

  @IsOptional()
  @IsEnum(AssetStatus, { message: 'Estado de activo inválido' })
  status?: AssetStatus;

  @IsOptional()
  @IsUUID('4', { message: 'userId debe ser un UUID válido' })
  userId?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  departmentId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observations?: string;
}

export class UpdateAssetDTO {
  @IsOptional() @IsString() @MinLength(2) @MaxLength(150) name?: string;
  @IsOptional() @IsString() @MinLength(2) type?: string;
  @IsOptional() @IsString() @MaxLength(100) brand?: string;
  @IsOptional() @IsString() @MaxLength(100) model?: string;
  @IsOptional() @IsString() @MaxLength(100) serialNumber?: string;
  @IsOptional() @IsString() @MaxLength(100) operatingSystem?: string;
  @IsOptional() @IsString() @MaxLength(50) osVersion?: string;
  @IsOptional() @IsString() @MaxLength(50) osBuild?: string;
  @IsOptional() @IsString() @MaxLength(20) architecture?: string;
  @IsOptional() @IsString() @MaxLength(45) ipAddress?: string;
  @IsOptional() @IsString() @MaxLength(17) macAddress?: string;
  @IsOptional() @IsString() @MaxLength(200) location?: string;
  @IsOptional() @IsDateString() acquisitionDate?: string;
  @IsOptional() @IsDateString() warrantyExpiration?: string;
  @IsOptional() @IsString() @MaxLength(500) observations?: string;
}

export class ChangeAssetStatusDTO {
  @IsEnum(AssetStatus, { message: 'Estado de activo inválido' })
  status: AssetStatus;
}

export class AssignUserDTO {
  @IsOptional()
  @IsUUID('4', { message: 'userId debe ser un UUID válido' })
  userId: string | null;
}

export class AssignDepartmentDTO {
  @IsOptional()
  @IsInt()
  departmentId: number | null;
}
