import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
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
        where: {
          email,
        },
      });

      if (!user) {
        throw new BadRequestException('Email o contraseña incorrectos');
      }

      const isPasswordMatch = await comparePassword(password, user.password);
      if (!isPasswordMatch) {
        throw new BadRequestException('Email o contraseña incorrectos');
      }
      const { password: _, ...userWithoutPassword } = user;

      const payload = { ...userWithoutPassword };
      const access_token = await this.jwtService.signAsync(payload);

      return { access_token };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al iniciar sesión');
    }
  }

  async getUsers() {
    return await this.prismaService.user.findMany();
  }
  async signUp(email: string, password: string) {
    try {
      const userFound = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });
      if (userFound) {
        throw new BadRequestException('El usuario ya existe');
      }

      const hashedPassword = await hashPassword(password);

      const user = await this.prismaService.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });

      const { password: _, ...userWithoutPassword } = user;

      const payload = { ...userWithoutPassword };
      const access_token = await this.jwtService.signAsync(payload);
      return { access_token, user: userWithoutPassword };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al registrar usuario');
    }
  }
}
