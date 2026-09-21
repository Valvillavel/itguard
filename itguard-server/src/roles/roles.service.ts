import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateRoleDTO, UpdateRoleDTO } from './dto/role.dto';

@Injectable()
export class RolesService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.role.findMany();
  }

  async findOne(id: number) {
    const role = await this.prismaService.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException('Rol no encontrado');
    return role;
  }

  async create(dto: CreateRoleDTO) {
    try {
      return await this.prismaService.role.create({ data: dto });
    } catch (error: any) {
      if (error?.code === 'P2002')
        throw new BadRequestException('El nombre de rol ya existe');
      throw new InternalServerErrorException('Error al crear rol');
    }
  }

  async update(id: number, dto: UpdateRoleDTO) {
    await this.findOne(id);
    try {
      return await this.prismaService.role.update({ where: { id }, data: dto });
    } catch {
      throw new InternalServerErrorException('Error al actualizar rol');
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    try {
      return await this.prismaService.role.delete({ where: { id } });
    } catch {
      throw new InternalServerErrorException('Error al eliminar rol');
    }
  }
}
