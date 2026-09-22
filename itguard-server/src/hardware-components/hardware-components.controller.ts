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
import { HardwareComponentsService } from './hardware-components.service';
import { CreateHardwareComponentDTO, UpdateHardwareComponentDTO } from './dto/hardware-component.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('hardware-components')
export class HardwareComponentsController {
  constructor(private readonly hardwareComponentsService: HardwareComponentsService) {}

  @Get()
  findAll() {
    return this.hardwareComponentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hardwareComponentsService.findOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() dto: CreateHardwareComponentDTO) {
    return this.hardwareComponentsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateHardwareComponentDTO) {
    return this.hardwareComponentsService.update(id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hardwareComponentsService.remove(id);
  }
}
