import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  register(@Body() body: { name: string, username: string, email: string, password: string }) {
    return this.authService.register_nick(body)
  }

  @Get('delete_users')
  del() {
    return this.authService.delete()
  }

  @Post('find_user')
  find_users(@Body() body: { room_id: string, name_user: string }) {
    return this.authService.find_user(body)
  }

  @Post('sec_password')
  sec_password(@Body() body: { user_username: string, password: string }) {
    return this.authService.sec_password(body)
  }
}
