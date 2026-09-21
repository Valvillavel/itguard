import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import type {
  CreateDepartmentDTO,
  UpdateDepartmentDTO,
} from './dto/department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private prismaService: PrismaService) {}

  async findAll() {
    return await this.prismaService.department.findMany();
  }

  async findOne(id: number) {
    const dept = await this.prismaService.department.findUnique({
      where: { id },
    });
    if (!dept) throw new NotFoundException('Departamento no encontrado');
    return dept;
  }

  async create(dto: CreateDepartmentDTO) {
    try {
      return await this.prismaService.department.create({ data: dto });
    } catch (error: any) {
      if (error?.code === 'P2002')
        throw new BadRequestException('El departamento ya existe');
      throw new InternalServerErrorException('Error al crear departamento');
    }
  }

  async update(id: number, dto: UpdateDepartmentDTO) {
    await this.findOne(id);
    try {
      return await this.prismaService.department.update({
        where: { id },
        data: dto,
      });
    } catch {
      throw new InternalServerErrorException(
        'Error al actualizar departamento',
      );
    }
  }

  async deactivate(id: number) {
    await this.findOne(id);
    return await this.prismaService.department.update({
      where: { id },
      data: { active: false },
    });
  }
}
