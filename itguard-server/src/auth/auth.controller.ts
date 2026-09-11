import { Body, Controller, Get, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import type { UserDTO } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('log-in')
  logIn() {
    return 'log-in';
  }

  @Post('sign-up')
  signUp(@Body() user: UserDTO) {
    console.log({ user });
    return this.authService.signUp(user.email, user.password);
  }
}
