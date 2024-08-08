import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() body: CreateUserDto) {
    return await this.authService.signUp(body);
  }

  @Post('signin')
  async signIn(@Body('username') username: string, @Body('password') password: string) {
    return await this.authService.signIn(username, password);
  }
}
