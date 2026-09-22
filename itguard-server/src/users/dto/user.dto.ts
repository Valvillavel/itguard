import { IsEmail, IsString, IsOptional, IsEnum, IsInt, MinLength, IsPositive } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class CreateUserDTO {
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;

  @IsString()
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  firstName: string;

  @IsString()
  @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
  lastName: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsInt({ message: 'roleId debe ser un número entero' })
  @IsPositive()
  roleId?: number;

  @IsOptional()
  @IsInt({ message: 'departmentId debe ser un número entero' })
  @IsPositive()
  departmentId?: number;
}

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  @MinLength(2)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  lastName?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsEnum(UserStatus, { message: 'Estado inválido. Use ACTIVO o INACTIVO' })
  status?: UserStatus;

  @IsOptional()
  @IsInt()
  @IsPositive()
  roleId?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  departmentId?: number;
}
