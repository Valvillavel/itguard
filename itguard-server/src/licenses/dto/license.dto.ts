import {
  IsInt, IsString, IsOptional, IsEnum, IsNumber,
  IsDateString, IsPositive, Min, MaxLength,
} from 'class-validator';
import { LicenseStatus } from '@prisma/client';

export class CreateLicenseDTO {
  @IsInt({ message: 'softwareId debe ser un entero' })
  @IsPositive()
  softwareId: number;

  @IsString({ message: 'El tipo de licencia es requerido' })
  @MaxLength(100)
  licenseType: string;

  @IsInt({ message: 'purchasedQuantity debe ser un entero' })
  @Min(1, { message: 'La cantidad debe ser mayor a 0' })
  purchasedQuantity: number;

  @IsOptional() @IsString() @MaxLength(100) reference?: string;
  @IsOptional() @IsDateString() purchaseDate?: string;
  @IsOptional() @IsDateString() activationDate?: string;
  @IsOptional() @IsDateString() expirationDate?: string;
  @IsOptional() @IsString() @MaxLength(150) provider?: string;

  @IsOptional()
  @IsNumber({}, { message: 'El costo debe ser un número' })
  @Min(0)
  cost?: number;

  @IsOptional() @IsString() @MaxLength(500) observations?: string;
}

export class UpdateLicenseDTO {
  @IsOptional() @IsString() @MaxLength(100) licenseType?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  purchasedQuantity?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  usedQuantity?: number;

  @IsOptional() @IsString() @MaxLength(100) reference?: string;
  @IsOptional() @IsDateString() purchaseDate?: string;
  @IsOptional() @IsDateString() activationDate?: string;
  @IsOptional() @IsDateString() expirationDate?: string;
  @IsOptional() @IsString() @MaxLength(150) provider?: string;
  @IsOptional() @IsNumber() @Min(0) cost?: number;

  @IsOptional()
  @IsEnum(LicenseStatus, { message: 'Estado de licencia inválido' })
  status?: LicenseStatus;

  @IsOptional() @IsString() @MaxLength(500) observations?: string;
}
