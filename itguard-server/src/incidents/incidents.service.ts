import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type { CreateIncidentDTO, UpdateIncidentDTO } from './dto/incident.dto';

const INCIDENT_INCLUDE = {
  asset: { select: { id: true, name: true, inventoryCode: true } },
  user: { select: { id: true, firstName: true, lastName: true, email: true } },
  responsible: {
    select: { id: true, firstName: true, lastName: true, email: true },
  },
} as const;

@Injectable()
export class IncidentsService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.incident.findMany({
      include: INCIDENT_INCLUDE,
      orderBy: { openedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.incident.findUnique({
      where: { id },
      include: INCIDENT_INCLUDE,
    });
    if (!item) throw new NotFoundException('Incidente no encontrado');
    return item;
  }

  async create(dto: CreateIncidentDTO) {
    try {
      return await this.prismaService.incident.create({
        data: dto,
        include: INCIDENT_INCLUDE,
      });
    } catch (error: any) {
      if (error?.code === 'P2002')
        throw new BadRequestException('El número de ticket ya existe');
      if (error?.code === 'P2003')
        throw new BadRequestException('Activo o usuario no encontrado');
      throw new InternalServerErrorException('Error al crear incidente');
    }
  }

  async update(id: number, dto: UpdateIncidentDTO) {
    await this.findOne(id);
    try {
      return await this.prismaService.incident.update({
        where: { id },
        data: dto as any,
        include: INCIDENT_INCLUDE,
      });
    } catch {
      throw new InternalServerErrorException('Error al actualizar incidente');
    }
  }

  async close(id: number) {
    await this.findOne(id);
    return await this.prismaService.incident.update({
      where: { id },
      data: { status: 'CERRADO', closedAt: new Date() },
      include: INCIDENT_INCLUDE,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prismaService.incident.delete({ where: { id } });
  }
}
