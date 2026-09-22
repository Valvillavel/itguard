import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLicenseDTO, UpdateLicenseDTO } from './dto/license.dto';

@Injectable()
export class LicensesService {
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
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;
    const where: Record<string, unknown> = {};
    if (query.search) {
      where['OR'] = [
        { licenseType: { contains: query.search } },
        { reference: { contains: query.search } },
        { provider: { contains: query.search } },
      ];
    }
    if (query.status) where['status'] = query.status;
    const [data, total] = await Promise.all([
      this.prismaService.license.findMany({
        where,
        skip,
        take: limit,
        include: { software: true },
      }),
      this.prismaService.license.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
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
