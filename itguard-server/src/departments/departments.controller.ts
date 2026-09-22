import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentDTO, UpdateDepartmentDTO } from './dto/department.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(JwtAuthGuard)
@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Get()
  findAll() {
    return this.departmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.findOne(id);
  }

  @Roles('ADMINISTRADOR_TI', 'GERENCIA')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() dto: CreateDepartmentDTO) {
    return this.departmentsService.create(dto);
  }

  @Roles('ADMINISTRADOR_TI', 'GERENCIA')
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDepartmentDTO) {
    return this.departmentsService.update(id, dto);
  }

  @Roles('ADMINISTRADOR_TI', 'GERENCIA')
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  deactivate(@Param('id', ParseIntPipe) id: number) {
    return this.departmentsService.deactivate(id);
  }
}
