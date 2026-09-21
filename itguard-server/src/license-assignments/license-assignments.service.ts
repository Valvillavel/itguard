import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type {
  CreateLicenseAssignmentDTO,
  UnassignLicenseDTO,
} from './dto/license-assignment.dto';

@Injectable()
export class LicenseAssignmentsService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.licenseAssignment.findMany({
      include: { license: true },
    });
  }

  async findOne(id: number) {
    const item = await this.prismaService.licenseAssignment.findUnique({
      where: { id },
      include: { license: true },
    });
    if (!item) throw new NotFoundException('Asignación no encontrada');
    return item;
  }

  async create(dto: CreateLicenseAssignmentDTO) {
    try {
      return await this.prismaService.licenseAssignment.create({
        data: dto,
        include: { license: true },
      });
    } catch (error: any) {
      if (error?.code === 'P2003')
        throw new BadRequestException('Licencia no encontrada');
      throw new InternalServerErrorException('Error al crear asignación');
    }
  }

  async unassign(id: number, dto: UnassignLicenseDTO) {
    await this.findOne(id);
    return await this.prismaService.licenseAssignment.update({
      where: { id },
      data: { unassignedAt: new Date(), ...dto },
      include: { license: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return await this.prismaService.licenseAssignment.delete({ where: { id } });
  }
}
