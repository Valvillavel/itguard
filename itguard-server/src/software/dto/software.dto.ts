import { IsString, IsOptional, IsBoolean, MinLength, MaxLength } from 'class-validator';

export class CreateSoftwareDTO {
  @IsString({ message: 'El nombre es requerido' })
  @MinLength(1)
  @MaxLength(150)
  name: string;

  @IsOptional() @IsString() @MaxLength(100) manufacturer?: string;
  @IsOptional() @IsString() @MaxLength(100) category?: string;
  @IsOptional() @IsString() @MaxLength(50) currentVersion?: string;

  @IsOptional()
  @IsBoolean({ message: 'requiresLicense debe ser boolean' })
  requiresLicense?: boolean;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

export class UpdateSoftwareDTO {
  @IsOptional() @IsString() @MinLength(1) @MaxLength(150) name?: string;
  @IsOptional() @IsString() @MaxLength(100) manufacturer?: string;
  @IsOptional() @IsString() @MaxLength(100) category?: string;
  @IsOptional() @IsString() @MaxLength(50) currentVersion?: string;
  @IsOptional() @IsBoolean() requiresLicense?: boolean;
  @IsOptional() @IsBoolean() active?: boolean;
}
