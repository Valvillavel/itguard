import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { hashPassword, comparePassword } from 'src/libs/bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async logIn(email: string, password: string) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: { email },
        include: { role: true },
      });

      if (!user) {
        throw new BadRequestException('Email o contraseña incorrectos');
      }

      const isPasswordMatch = await comparePassword(password, user.password);
      if (!isPasswordMatch) {
        throw new BadRequestException('Email o contraseña incorrectos');
      }

      if (user.status !== 'ACTIVO') {
        throw new BadRequestException(
          'Tu cuenta está inactiva. Contacta al administrador.',
        );
      }

      const { password: _p, ...userWithoutPassword } = user;
      const access_token = await this.jwtService.signAsync(userWithoutPassword);
      return { access_token };
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Error al iniciar sesión');
    }
  }

  async getUsers() {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) {
    try {
      const userFound = await this.prismaService.user.findUnique({
        where: { email },
      });
      if (userFound) {
        throw new BadRequestException('El usuario ya existe');
      }

      const defaultRole = await this.prismaService.role.findUnique({
        where: { name: 'USUARIO' },
      });
      if (!defaultRole) {
        throw new InternalServerErrorException(
          'Rol USUARIO no encontrado. Ejecute el seed primero.',
        );
      }

      const hashedPassword = await hashPassword(password);

      const user = await this.prismaService.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          roleId: defaultRole.id,
        },
      });

      const { password: _p, ...userWithoutPassword } = user;
      const access_token = await this.jwtService.signAsync(userWithoutPassword);
      return { access_token, user: userWithoutPassword };
    } catch (error) {
      if (
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al registrar usuario');
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch)
      throw new BadRequestException('La contraseña actual es incorrecta');

    if (newPassword.length < 8) {
      throw new BadRequestException(
        'La nueva contraseña debe tener al menos 8 caracteres',
      );
    }

    const hashed = await hashPassword(newPassword);
    await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashed },
    });

    return { message: 'Contraseña actualizada correctamente' };
  }
}
