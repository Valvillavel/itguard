import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LogInDTO, SignUpDTO, ChangePasswordDTO } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  logIn(@Body() body: LogInDTO) {
    return this.authService.logIn(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('users')
  getUsers() {
    return this.authService.getUsers();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  signUp(@Body() body: SignUpDTO) {
    return this.authService.signUp(body.email, body.password, body.firstName, body.lastName);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('change-password')
  changePassword(@Req() req: Request, @Body() body: ChangePasswordDTO) {
    const userId = (req as any)['user']?.id as string;
    return this.authService.changePassword(userId, body.currentPassword, body.newPassword);
  }
}
