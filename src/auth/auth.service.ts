import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { JwtPayload } from './jwt.payload';
import { CreateUserDto } from '../user/dto/create-user.dto';


@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(CreateUserDto) {
   
    const user = await this.userService.create(CreateUserDto);
    return this.createToken(user);
  }

  async signIn(username: string, pass: string) {
    const user = await this.userService.findByUsername(username);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException();
    }
    return this.createToken(user);
  }

  private createToken(user: any) {
    const payload: JwtPayload = { sub: user.id, username: user.username ,role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
