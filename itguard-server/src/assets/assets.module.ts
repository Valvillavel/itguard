import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetsService } from './assets.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Module({
  imports: [PrismaModule],
  controllers: [AssetsController],
  providers: [AssetsService, JwtAuthGuard],
})
export class AssetsModule {}
