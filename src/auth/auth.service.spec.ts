import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtPayload } from './jwt.payload';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

// Mock the dependencies
const mockUserService = () => ({
  create: jest.fn(),
  findByUsername: jest.fn(),
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useFactory: mockUserService },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    it('should call userService.create and return a token', async () => {
      const userDto = { username: 'test', password: 'password' };
      const user = { id: 1, username: 'test', password: 'hashedpassword', role: 'user' };

      jest.spyOn(userService, 'create').mockResolvedValue(user as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await authService.signUp(userDto);

      expect(userService.create).toHaveBeenCalledWith(userDto);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: user.id, username: user.username, role: user.role });
      expect(result).toEqual({ access_token: 'token' });
    });
  });

  describe('signIn', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(userService, 'findByUsername').mockResolvedValue(null);

      await expect(authService.signIn('test', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const user = { id: 1, username: 'test', password: 'hashedpassword', role: 'user' };

      jest.spyOn(userService, 'findByUsername').mockResolvedValue(user as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(authService.signIn('test', 'password')).rejects.toThrow(UnauthorizedException);
    });

    it('should return a token if credentials are valid', async () => {
      const user = { id: 1, username: 'test', password: 'hashedpassword', role: 'user' };

      jest.spyOn(userService, 'findByUsername').mockResolvedValue(user as any);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      jest.spyOn(jwtService, 'sign').mockReturnValue('token');

      const result = await authService.signIn('test', 'password');

      expect(userService.findByUsername).toHaveBeenCalledWith('test');
      expect(bcrypt.compare).toHaveBeenCalledWith('password', user.password);
      expect(jwtService.sign).toHaveBeenCalledWith({ sub: user.id, username: user.username, role: user.role });
      expect(result).toEqual({ access_token: 'token' });
    });
  });
});
