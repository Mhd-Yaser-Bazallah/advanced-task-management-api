import { BadRequestException, Injectable ,NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import{Task} from './entities/task.entity'
import { TaskFields } from './entities/TaskFields.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task) private readonly TaskRepository: Repository<Task>
  ) {}

  create(createTaskDto: CreateTaskDto) {
    const Task = this.TaskRepository.create(createTaskDto)
    return this.TaskRepository.save(createTaskDto);
  }

  async findAll(query: { keyword?: string; field?: string; page?: number; limit?: number }): Promise<{ tasks: Task[]; total: number }> {
    const { keyword, field, page = 1, limit = 10 } = query;

    const queryBuilder = this.TaskRepository.createQueryBuilder('Task');

    if (keyword && field) {
      
      if (!Object.values(TaskFields).includes(field as TaskFields)) {
        throw new BadRequestException('Invalid field for search');
      }

      // Use parameterized query to prevent SQL injection
      queryBuilder.andWhere(`Task.${field} LIKE :keyword`, { keyword: `%${keyword}%` });
    }

    // Pagination
    const [tasks, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { tasks, total };
  }



  findOne(id: number):Promise<Task>  {
    if (!id) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return this.TaskRepository.findOneBy({id});
  }

  async update(id: number, attrs: Partial<Task>) {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    Object.assign(task, attrs);
    return this.TaskRepository.save(task);
  }

  async delete(id: number) {
    const task = await this.findOne(id);
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return this.TaskRepository.remove(task);
  }
}
