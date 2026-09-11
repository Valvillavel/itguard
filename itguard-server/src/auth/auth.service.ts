import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prismaService: PrismaService) {}
  /* async getUsers() {
    return await this.prismaService.user.findMany();
  } */
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
      const user = await this.prismaService.user.create({
        data: {
          email,
          password,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new Error(error);
    }
  }
}
