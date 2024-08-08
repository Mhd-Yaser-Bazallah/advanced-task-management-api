import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByUsername should return a user if found', async () => {
    const user = { id: 1, username: 'testuser' } as User;
    mockUserRepository.findOne.mockResolvedValue(user);
    expect(await service.findByUsername('testuser')).toEqual(user);
  });

  it('findByUsername should throw NotFoundException if user not found', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);
    await expect(service.findByUsername('testuser')).rejects.toThrow(
      new NotFoundException(`User with username testuser not found`),
    );
  });

  it('findOne should return a user by id if found', async () => {
    const user = { id: 1, username: 'testuser' } as User;
    mockUserRepository.findOne.mockResolvedValue(user);
    expect(await service.findOne(1)).toEqual(user);
  });

  it('findOne should throw NotFoundException if user not found', async () => {
    mockUserRepository.findOne.mockResolvedValue(null);
    await expect(service.findOne(1)).rejects.toThrow(
      new NotFoundException(`User with id 1 not found`),
    );
  });

  it('create should create and save a user', async () => {
    const user = { username: 'testuser' } as User;
    mockUserRepository.create.mockReturnValue(user);
    mockUserRepository.save.mockResolvedValue(user);
    expect(await service.create(user)).toEqual(user);
  });

  it('findAll should return an array of users', async () => {
    const users = [{ id: 1, username: 'testuser' }] as User[];
    mockUserRepository.find.mockResolvedValue(users);
    expect(await service.findAll()).toEqual(users);
  });
});
