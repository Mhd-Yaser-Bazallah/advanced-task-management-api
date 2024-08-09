import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';


@Controller('users')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async signUp(@Body() body: CreateUserDto) {
    return await this.authService.signUp(body);
  }

  @Post('login')
  async signIn(@Body('username') username: string, @Body('password') password: string) {
    return await this.authService.signIn(username, password);
  }
}
