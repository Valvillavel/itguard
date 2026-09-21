import { Module } from '@nestjs/common';
import { InstalledSoftwareController } from './installed-software.controller';
import { InstalledSoftwareService } from './installed-software.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [InstalledSoftwareController],
  providers: [InstalledSoftwareService, JwtAuthGuard],
})
export class InstalledSoftwareModule {}
