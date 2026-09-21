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
  UseGuards,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import type {
  AssignDepartmentDTO,
  AssignUserDTO,
  ChangeAssetStatusDTO,
  CreateAssetDTO,
  UpdateAssetDTO,
} from './dto/asset.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  findAll() {
    return this.assetsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.assetsService.findOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() dto: CreateAssetDTO) {
    return this.assetsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAssetDTO) {
    return this.assetsService.update(id, dto);
  }

  @Patch(':id/status')
  changeStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangeAssetStatusDTO,
  ) {
    return this.assetsService.changeStatus(id, dto);
  }

  @Patch(':id/assign-user')
  assignUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignUserDTO,
  ) {
    return this.assetsService.assignUser(id, dto);
  }

  @Patch(':id/assign-department')
  assignDepartment(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AssignDepartmentDTO,
  ) {
    return this.assetsService.assignDepartment(id, dto);
  }

  @Get(':id/hardware')
  getHardwareComponents(@Param('id', ParseIntPipe) id: number) {
    return this.assetsService.getHardwareComponents(id);
  }

  @Get(':id/software')
  getInstalledSoftware(@Param('id', ParseIntPipe) id: number) {
    return this.assetsService.getInstalledSoftware(id);
  }

  @Get(':id/maintenance')
  getMaintenance(@Param('id', ParseIntPipe) id: number) {
    return this.assetsService.getMaintenance(id);
  }

  @Get(':id/incidents')
  getIncidents(@Param('id', ParseIntPipe) id: number) {
    return this.assetsService.getIncidents(id);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.assetsService.remove(id);
  }
}
