import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateMaintenanceDTO,
  UpdateMaintenanceDTO,
} from './dto/maintenance.dto';

@Injectable()
export class MaintenanceService {
  constructor(private prismaService: PrismaService) {}

  async findAll(
    query: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      type?: string;
    } = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (query.search) {
      where['OR'] = [
        { technician: { contains: query.search } },
        { description: { contains: query.search } },
      ];
    }
    if (query.status) where['status'] = query.status;
    if (query.type) where['type'] = query.type;
    const [data, total] = await Promise.all([
      this.prismaService.maintenance.findMany({
        where,
        skip,
        take: limit,
        include: { asset: true },
        orderBy: { date: 'desc' },
      }),
      this.prismaService.maintenance.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
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
