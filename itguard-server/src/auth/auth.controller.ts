import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import type { UserDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('log-in')
  logIn(@Body() user: UserDTO) {
    return this.authService.logIn(user.email, user.password);
  }
  @Get('users')
  getUsers() {
    return this.authService.getUsers();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('sign-up')
  signUp(@Body() user: UserDTO) {
    console.log({ user });
    return this.authService.signUp(user.email, user.password);
  }
}
