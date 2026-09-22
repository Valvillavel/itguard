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
import { InstalledSoftwareService } from './installed-software.service';
import { CreateInstalledSoftwareDTO, UpdateInstalledSoftwareDTO } from './dto/installed-software.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('installed-software')
export class InstalledSoftwareController {
  constructor(private readonly installedSoftwareService: InstalledSoftwareService) {}

  @Get()
  findAll() {
    return this.installedSoftwareService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.installedSoftwareService.findOne(id);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() dto: CreateInstalledSoftwareDTO) {
    return this.installedSoftwareService.create(dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateInstalledSoftwareDTO) {
    return this.installedSoftwareService.update(id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.installedSoftwareService.remove(id);
  }
}
