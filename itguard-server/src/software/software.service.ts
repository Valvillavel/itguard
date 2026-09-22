import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSoftwareDTO, UpdateSoftwareDTO } from './dto/software.dto';

@Injectable()
export class SoftwareService {
  constructor(private prismaService: PrismaService) {}

  async findAll(
    query: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
    } = {},
  ) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 100;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (query.search) {
      where['OR'] = [
        { name: { contains: query.search } },
        { manufacturer: { contains: query.search } },
        { category: { contains: query.search } },
      ];
    }
    if (query.status === 'active') where['active'] = true;
    else if (query.status === 'inactive') where['active'] = false;
    const [data, total] = await Promise.all([
      this.prismaService.software.findMany({ where, skip, take: limit }),
      this.prismaService.software.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
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
    // Soft delete â€” consistent with Department.deactivate()
    return await this.prismaService.software.update({
      where: { id },
      data: { active: false },
    });
  }
}
