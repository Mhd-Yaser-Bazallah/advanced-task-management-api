import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { NotFoundException } from '@nestjs/common';
import { UserRole } from './entities/user-role.enum';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            // other methods as necessary
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should create a user', async () => {
    const createUserDto: CreateUserDto = {
      username: 'testuser',
      password: 'testpassword',
      role:UserRole.USER
      // other fields as necessary
    };

    jest.spyOn(service, 'create').mockResolvedValue(createUserDto as any);

    const result = await controller.create(createUserDto);

    expect(result).toEqual(createUserDto);
  });

  it('should return all users', async () => {
    const result = [{ username: 'testuser', password: 'testpassword' }];

    jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

    expect(await controller.findAll()).toEqual(result);
  });
});
