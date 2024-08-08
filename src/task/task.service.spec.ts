import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskService } from './task.service';
import { Task } from './entities/task.entity';
import { NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let repository: Repository<Task>;

  const mockTaskRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      skip: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getManyAndCount: jest.fn().mockReturnValue([[], 0]),
    }),
    delete: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create should create and save a task', async () => {
    const task = { title: 'Test task', description: 'Test description' } as Task;
    mockTaskRepository.create.mockReturnValue(task);
    mockTaskRepository.save.mockResolvedValue(task);
    expect(await service.create(task)).toEqual(task);
  });

  it('findAll should return tasks and total count', async () => {
    const query = { keyword: '', field: '', page: 1, limit: 10 };
    const tasks = [{ id: 1, title: 'Test task' }] as Task[];
    mockTaskRepository.createQueryBuilder().getManyAndCount.mockResolvedValue([tasks, tasks.length]);
    expect(await service.findAll(query)).toEqual({ tasks, total: tasks.length });
  });

  it('findOne should return a task by id', async () => {
    const task = { id: 1, title: 'Test task' } as Task;
    mockTaskRepository.findOneBy.mockResolvedValue(task);
    expect(await service.findOne(1)).toEqual(task);
  });

  it('update should update and save a task', async () => {
    const task = { id: 1, title: 'Updated task' } as Task;
    mockTaskRepository.findOneBy.mockResolvedValue(task);
    mockTaskRepository.save.mockResolvedValue(task);
    expect(await service.update(1, task)).toEqual(task);
  });

  it('delete should remove a task', async () => {
    const task = { id: 1, title: 'Test task' } as Task;
    mockTaskRepository.findOneBy.mockResolvedValue(task);
    mockTaskRepository.remove.mockResolvedValue(task);
    expect(await service.delete(1)).toEqual(task);
  });
});
