import { Controller, Get, Post, Body, UseGuards,Patch, Param, Delete, Query, NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { JwtAuthGuard } from './../auth/JwtAuthGuard';
import { RolesGuard } from '../user/roles.guard';
import { Roles } from '../user/roles.decorator';
import { UserRole } from '../user/entities/user-role.enum';


@Controller('task')
//@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  async findAll(
    @Query() query: { keyword?: string; field?: string; page?: number; limit?: number }
  ): Promise<{ tasks: Task[]; total: number }> {
    return  await this.taskService.findAll(query);
  }

  @Get(':id')
 async findOne(@Param('id') id: string) {  
    const task = await this.taskService.findOne(+id);
    if(!task){
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    else return task;
    
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN) 
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {

    return  await this.taskService.update(+id, updateTaskDto);
  }

  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN) 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.delete(+id);
  }
}
