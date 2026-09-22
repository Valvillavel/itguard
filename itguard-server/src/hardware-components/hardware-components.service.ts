import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateHardwareComponentDTO,
  UpdateHardwareComponentDTO,
} from './dto/hardware-component.dto';

@Injectable()
export class HardwareComponentsService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.hardwareComponent.findMany({
      include: { asset: true },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.hardwareComponent.findUnique({
      where: { id },
      include: { asset: true },
    });
    if (!item) throw new NotFoundException('Componente no encontrado');
    return item;
  }

  async create(dto: CreateHardwareComponentDTO) {
    try {
      return await this.prismaService.hardwareComponent.create({
        data: dto as any,
        include: { asset: true },
      });
    } catch (error: any) {
      if (error?.code === 'P2003')
        throw new BadRequestException('Activo no encontrado');
      throw new InternalServerErrorException('Error al crear componente');
    }
  }

  async update(id: number, dto: UpdateHardwareComponentDTO) {
    await this.findOne(id);
    try {
      return await this.prismaService.hardwareComponent.update({
        where: { id },
        data: dto as any,
        include: { asset: true },
      });
    } catch {
      throw new InternalServerErrorException('Error al actualizar componente');
    }
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prismaService.hardwareComponent.delete({ where: { id } });
  }
}
