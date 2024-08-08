import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';
import { UserRole } from './entities/user-role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.OWNER, UserRole.ADMIN) 
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  
 
}
