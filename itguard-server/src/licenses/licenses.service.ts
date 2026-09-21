import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateLicenseDTO, UpdateLicenseDTO } from './dto/license.dto';

@Injectable()
export class LicensesService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.license.findMany({
      include: { software: true },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.license.findUnique({
      where: { id },
      include: { software: true, assignments: true },
    });
    if (!item) throw new NotFoundException('Licencia no encontrada');
    return item;
  }

  async create(dto: CreateLicenseDTO) {
    try {
      return await this.prismaService.license.create({
        data: dto as any,
        include: { software: true },
      });
    } catch (error: any) {
      if (error?.code === 'P2003')
        throw new BadRequestException('Software no encontrado');
      throw new InternalServerErrorException('Error al crear licencia');
    }
  }

  async update(id: number, dto: UpdateLicenseDTO) {
    await this.findOne(id);
    try {
      return await this.prismaService.license.update({
        where: { id },
        data: dto as any,
        include: { software: true },
      });
    } catch {
      throw new InternalServerErrorException('Error al actualizar licencia');
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prismaService.license.delete({ where: { id } });
  }
}
