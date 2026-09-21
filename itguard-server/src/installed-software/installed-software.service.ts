import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type {
  CreateInstalledSoftwareDTO,
  UpdateInstalledSoftwareDTO,
} from './dto/installed-software.dto';

@Injectable()
export class InstalledSoftwareService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.installedSoftware.findMany({
      include: { asset: true, software: true },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.installedSoftware.findUnique({
      where: { id },
      include: { asset: true, software: true },
    });
    if (!item) throw new NotFoundException('Software instalado no encontrado');
    return item;
  }

  async create(dto: CreateInstalledSoftwareDTO) {
    try {
      return await this.prismaService.installedSoftware.create({
        data: dto as any,
        include: { asset: true, software: true },
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new BadRequestException(
          'El software ya está instalado en ese activo',
        );
      }
      if (error?.code === 'P2003')
        throw new BadRequestException('Activo o software no encontrado');
      throw new InternalServerErrorException(
        'Error al registrar software instalado',
      );
    }
  }

  async update(id: number, dto: UpdateInstalledSoftwareDTO) {
    await this.findOne(id);
    try {
      return await this.prismaService.installedSoftware.update({
        where: { id },
        data: dto as any,
        include: { asset: true, software: true },
      });
    } catch {
      throw new InternalServerErrorException(
        'Error al actualizar software instalado',
      );
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prismaService.installedSoftware.delete({ where: { id } });
  }
}
