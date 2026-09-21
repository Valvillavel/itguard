import { Module } from '@nestjs/common';
import { LicenseAssignmentsController } from './license-assignments.controller';
import { LicenseAssignmentsService } from './license-assignments.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [LicenseAssignmentsController],
  providers: [LicenseAssignmentsService, JwtAuthGuard],
})
export class LicenseAssignmentsModule {}
