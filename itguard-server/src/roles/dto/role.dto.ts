import { IsString, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateRoleDTO {
  @IsString({ message: 'El nombre del rol es requerido' })
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;
}

export class UpdateRoleDTO {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  description?: string;
}
