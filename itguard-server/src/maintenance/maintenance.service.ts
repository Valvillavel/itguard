import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type {
  CreateMaintenanceDTO,
  UpdateMaintenanceDTO,
} from './dto/maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.maintenance.findMany({
      include: { asset: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.maintenance.findUnique({
      where: { id },
      include: { asset: true },
    });
    if (!item) throw new NotFoundException('Mantenimiento no encontrado');
    return item;
  }

  async create(dto: CreateMaintenanceDTO) {
    try {
      return await this.prismaService.maintenance.create({
        data: dto as any,
        include: { asset: true },
      });
    } catch (error: any) {
      if (error?.code === 'P2003')
        throw new BadRequestException('Activo no encontrado');
      throw new InternalServerErrorException('Error al crear mantenimiento');
    }
  }

  async update(id: number, dto: UpdateMaintenanceDTO) {
    await this.findOne(id);
    try {
      return await this.prismaService.maintenance.update({
        where: { id },
        data: dto as any,
        include: { asset: true },
      });
    } catch {
      throw new InternalServerErrorException(
        'Error al actualizar mantenimiento',
      );
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prismaService.maintenance.delete({ where: { id } });
  }
}
