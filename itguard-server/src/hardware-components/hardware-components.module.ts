import { Module } from '@nestjs/common';
import { HardwareComponentsController } from './hardware-components.controller';
import { HardwareComponentsService } from './hardware-components.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [HardwareComponentsController],
  providers: [HardwareComponentsService, JwtAuthGuard],
})
export class HardwareComponentsModule {}
