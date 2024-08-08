import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';
import{AuthController}from './auth.controller';


@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: 'yaserbazallah',  
      signOptions: { expiresIn: '30m' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
