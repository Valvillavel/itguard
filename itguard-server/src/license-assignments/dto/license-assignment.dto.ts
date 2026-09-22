import { IsInt, IsOptional, IsString, IsUUID, IsPositive, MaxLength } from 'class-validator';

export class CreateLicenseAssignmentDTO {
  @IsInt({ message: 'licenseId debe ser un entero' })
  @IsPositive()
  licenseId: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  assetId?: number;

  @IsOptional()
  @IsUUID('4', { message: 'userId debe ser un UUID válido' })
  userId?: string;

  @IsOptional()
  @IsUUID('4', { message: 'assignedById debe ser un UUID válido' })
  assignedById?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observations?: string;
}

export class UnassignLicenseDTO {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  observations?: string;
}
