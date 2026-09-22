import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  AssignDepartmentDTO,
  AssignUserDTO,
  ChangeAssetStatusDTO,
  CreateAssetDTO,
  UpdateAssetDTO,
} from './dto/asset.dto';

const ASSET_INCLUDE = {
  user: { select: { id: true, firstName: true, lastName: true, email: true } },
  department: { select: { id: true, name: true } },
} as const;

@Injectable()
export class AssetsService {
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
        { name: { contains: query.search } },
        { inventoryCode: { contains: query.search } },
        { type: { contains: query.search } },
        { brand: { contains: query.search } },
      ];
    }
    if (query.status) where['status'] = query.status;
    const [data, total] = await Promise.all([
      this.prismaService.asset.findMany({
        where,
        skip,
        take: limit,
        include: ASSET_INCLUDE,
      }),
      this.prismaService.asset.count({ where }),
    ]);
    return {
      data,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: number) {
    const asset = await this.prismaService.asset.findUnique({
      where: { id },
      include: ASSET_INCLUDE,
    });
    if (!asset) throw new NotFoundException('Activo no encontrado');
    return asset;
  }

  async create(dto: CreateAssetDTO) {
    try {
      return await this.prismaService.asset.create({
        data: dto as any,
        include: ASSET_INCLUDE,
      });
    } catch (error: any) {
      if (error?.code === 'P2002') {
        throw new BadRequestException(
          'Código de inventario o número de serie duplicado',
        );
      }
      throw new InternalServerErrorException('Error al crear activo');
    }
  }

  async update(id: number, dto: UpdateAssetDTO) {
    await this.findOne(id);
    try {
      return await this.prismaService.asset.update({
        where: { id },
        data: dto as any,
        include: ASSET_INCLUDE,
      });
    } catch {
      throw new InternalServerErrorException('Error al actualizar activo');
    }
  }

  async changeStatus(id: number, dto: ChangeAssetStatusDTO) {
    await this.findOne(id);
    return await this.prismaService.asset.update({
      where: { id },
      data: { status: dto.status },
      include: ASSET_INCLUDE,
    });
  }

  async assignUser(id: number, dto: AssignUserDTO) {
    await this.findOne(id);
    return await this.prismaService.asset.update({
      where: { id },
      data: {
        userId: dto.userId,
        assignmentDate: dto.userId ? new Date() : null,
      },
      include: ASSET_INCLUDE,
    });
  }

  async assignDepartment(id: number, dto: AssignDepartmentDTO) {
    await this.findOne(id);
    return await this.prismaService.asset.update({
      where: { id },
      data: { departmentId: dto.departmentId },
      include: ASSET_INCLUDE,
    });
  }

  async getHardwareComponents(id: number) {
    await this.findOne(id);
    return await this.prismaService.hardwareComponent.findMany({
      where: { assetId: id },
    });
  }

  async getInstalledSoftware(id: number) {
    await this.findOne(id);
    return await this.prismaService.installedSoftware.findMany({
      where: { assetId: id },
      include: { software: true },
    });
  }

  async getMaintenance(id: number) {
    await this.findOne(id);
    return await this.prismaService.maintenance.findMany({
      where: { assetId: id },
      orderBy: { date: 'desc' },
    });
  }

  async getIncidents(id: number) {
    await this.findOne(id);
    return await this.prismaService.incident.findMany({
      where: { assetId: id },
      orderBy: { openedAt: 'desc' },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prismaService.asset.delete({ where: { id } });
  }
}
