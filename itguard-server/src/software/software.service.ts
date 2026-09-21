import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateSoftwareDTO, UpdateSoftwareDTO } from './dto/software.dto';

@Injectable()
export class SoftwareService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.software.findMany();
  }

  async findOne(id: number) {
    const item = await this.prismaService.software.findUnique({
      where: { id },
    });
    if (!item) throw new NotFoundException('Software no encontrado');
    return item;
  }

  async create(dto: CreateSoftwareDTO) {
    try {
      return await this.prismaService.software.create({ data: dto });
    } catch (error: any) {
      if (error?.code === 'P2002')
        throw new BadRequestException('El software ya existe');
      throw new InternalServerErrorException('Error al crear software');
    }
  }

  async update(id: number, dto: UpdateSoftwareDTO) {
    await this.findOne(id);
    try {
      return await this.prismaService.software.update({
        where: { id },
        data: dto,
      });
    } catch {
      throw new InternalServerErrorException('Error al actualizar software');
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prismaService.software.delete({ where: { id } });
  }
}
