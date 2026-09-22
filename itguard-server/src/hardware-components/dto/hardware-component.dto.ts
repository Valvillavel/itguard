import { IsString, IsOptional, IsInt, IsPositive, IsDateString, MaxLength } from 'class-validator';

export class CreateHardwareComponentDTO {
  @IsInt({ message: 'assetId debe ser un número entero' })
  @IsPositive()
  assetId: number;

  @IsString({ message: 'El tipo es requerido' })
  @MaxLength(100)
  type: string;

  @IsOptional() @IsString() @MaxLength(100) brand?: string;
  @IsOptional() @IsString() @MaxLength(100) model?: string;
  @IsOptional() @IsString() @MaxLength(100) serialNumber?: string;
  @IsOptional() @IsString() @MaxLength(50) capacity?: string;
  @IsOptional() @IsString() @MaxLength(50) status?: string;
  @IsOptional() @IsDateString() installationDate?: string;
  @IsOptional() @IsDateString() removalDate?: string;
  @IsOptional() @IsString() @MaxLength(500) observations?: string;
}

export class UpdateHardwareComponentDTO {
  @IsOptional() @IsString() @MaxLength(100) type?: string;
  @IsOptional() @IsString() @MaxLength(100) brand?: string;
  @IsOptional() @IsString() @MaxLength(100) model?: string;
  @IsOptional() @IsString() @MaxLength(100) serialNumber?: string;
  @IsOptional() @IsString() @MaxLength(50) capacity?: string;
  @IsOptional() @IsString() @MaxLength(50) status?: string;
  @IsOptional() @IsDateString() installationDate?: string;
  @IsOptional() @IsDateString() removalDate?: string;
  @IsOptional() @IsString() @MaxLength(500) observations?: string;
}
