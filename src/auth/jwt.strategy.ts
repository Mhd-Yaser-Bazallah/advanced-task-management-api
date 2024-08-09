import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './jwt.payload';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'yaserbazallah', 
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { sub: id } = payload;
    return this.userService.findOne(id);
  }
}
