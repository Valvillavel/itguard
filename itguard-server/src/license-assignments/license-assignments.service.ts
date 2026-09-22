import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLicenseAssignmentDTO, UnassignLicenseDTO } from './dto/license-assignment.dto';

const ASSIGNMENT_INCLUDE = {
  license: { include: { software: { select: { id: true, name: true } } } },
  user: { select: { id: true, firstName: true, lastName: true, email: true } },
  assignedBy: { select: { id: true, firstName: true, lastName: true, email: true } },
} as const;

@Injectable()
export class LicenseAssignmentsService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.licenseAssignment.findMany({
      include: ASSIGNMENT_INCLUDE,
      orderBy: { assignedAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.licenseAssignment.findUnique({
      where: { id },
      include: ASSIGNMENT_INCLUDE,
    });
    if (!item) throw new NotFoundException('Asignación no encontrada');
    return item;
  }

  async create(dto: CreateLicenseAssignmentDTO) {
    const license = await this.prismaService.license.findUnique({
      where: { id: dto.licenseId },
    });
    if (!license) throw new NotFoundException('Licencia no encontrada');
    if (license.usedQuantity >= license.purchasedQuantity) {
      throw new BadRequestException(
        `No hay licencias disponibles. Usadas: ${license.usedQuantity}/${license.purchasedQuantity}`,
      );
    }

    try {
      return await this.prismaService.$transaction(async (tx) => {
        const assignment = await tx.licenseAssignment.create({
          data: dto,
          include: ASSIGNMENT_INCLUDE,
        });
        await tx.license.update({
          where: { id: dto.licenseId },
          data: { usedQuantity: { increment: 1 } },
        });
        return assignment;
      });
    } catch (error: any) {
      if (error instanceof BadRequestException) throw error;
      if (error?.code === 'P2003')
        throw new BadRequestException('Licencia, activo o usuario no encontrado');
      throw new InternalServerErrorException('Error al crear asignación');
    }
  }

  async unassign(id: number, dto: UnassignLicenseDTO) {
    const assignment = await this.findOne(id);
    if (assignment.unassignedAt) {
      throw new BadRequestException('Esta asignación ya fue desasignada');
    }

    return await this.prismaService.$transaction(async (tx) => {
      const updated = await tx.licenseAssignment.update({
        where: { id },
        data: { unassignedAt: new Date(), status: 'DESASIGNADA', ...dto },
        include: ASSIGNMENT_INCLUDE,
      });
      await tx.license.update({
        where: { id: assignment.licenseId },
        data: { usedQuantity: { decrement: 1 } },
      });
      return updated;
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prismaService.licenseAssignment.delete({ where: { id } });
  }
}
