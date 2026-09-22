import { IsInt, IsOptional, IsString, IsPositive, IsDateString, MaxLength } from 'class-validator';

export class CreateInstalledSoftwareDTO {
  @IsInt({ message: 'assetId debe ser un entero' })
  @IsPositive()
  assetId: number;

  @IsInt({ message: 'softwareId debe ser un entero' })
  @IsPositive()
  softwareId: number;

  @IsOptional() @IsString() @MaxLength(50) version?: string;
  @IsOptional() @IsDateString() installedAt?: string;
  @IsOptional() @IsString() @MaxLength(50) status?: string;
}

export class UpdateInstalledSoftwareDTO {
  @IsOptional() @IsString() @MaxLength(50) version?: string;
  @IsOptional() @IsDateString() lastCheck?: string;
  @IsOptional() @IsString() @MaxLength(50) status?: string;
}
