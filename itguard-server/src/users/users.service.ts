import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { hashPassword } from 'src/libs/bcrypt';
import { CreateUserDTO, UpdateUserDTO } from './dto/user.dto';
import {
  PaginationQueryDto,
  buildPaginatedResponse,
} from 'src/common/dto/pagination.dto';

const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  username: true,
  phone: true,
  position: true,
  status: true,
  roleId: true,
  departmentId: true,
  createdAt: true,
  updatedAt: true,
  role: { select: { id: true, name: true } },
  department: { select: { id: true, name: true } },
} as const;

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  async findAll(query: PaginationQueryDto = {}) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 50;
    const skip = (page - 1) * limit;
    const search = query.search;
    const statusFilter = query.status;

    const where: Record<string, unknown> = {};
    if (search) {
      where['OR'] = [
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { email: { contains: search } },
        { username: { contains: search } },
      ];
    }
    if (statusFilter) where['status'] = statusFilter;

    const [data, total] = await Promise.all([
      this.prismaService.user.findMany({
        where,
        skip,
        take: limit,
        select: USER_SELECT,
      }),
      this.prismaService.user.count({ where }),
    ]);

    return buildPaginatedResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async create(dto: CreateUserDTO) {
    try {
      const exists = await this.prismaService.user.findUnique({
        where: { email: dto.email },
      });
      if (exists) throw new BadRequestException('El email ya está registrado');

      const hashedPassword = await hashPassword(dto.password);
      return await this.prismaService.user.create({
        data: { ...dto, password: hashedPassword },
        select: USER_SELECT,
      });
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Error al crear usuario');
    }
  }

  async update(id: string, dto: UpdateUserDTO) {
    await this.findOne(id);
    try {
      return await this.prismaService.user.update({
        where: { id },
        data: dto,
        select: USER_SELECT,
      });
    } catch {
      throw new InternalServerErrorException('Error al actualizar usuario');
    }
  }

  async deactivate(id: string) {
    await this.findOne(id);
    return await this.prismaService.user.update({
      where: { id },
      data: { status: 'INACTIVO' },
      select: USER_SELECT,
    });
  }
}
