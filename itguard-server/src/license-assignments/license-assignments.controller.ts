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
import { LicenseAssignmentsService } from './license-assignments.service';
import { CreateLicenseAssignmentDTO, UnassignLicenseDTO } from './dto/license-assignment.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('license-assignments')
export class LicenseAssignmentsController {
  constructor(private readonly licenseAssignmentsService: LicenseAssignmentsService) {}

  @Get()
  findAll() {
    return this.licenseAssignmentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.licenseAssignmentsService.findOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() dto: CreateLicenseAssignmentDTO) {
    return this.licenseAssignmentsService.create(dto);
  }

  @Patch(':id/unassign')
  unassign(@Param('id', ParseIntPipe) id: number, @Body() dto: UnassignLicenseDTO) {
    return this.licenseAssignmentsService.unassign(id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.licenseAssignmentsService.remove(id);
  }
}
