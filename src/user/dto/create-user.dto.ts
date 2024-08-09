import{UserRole}from './../entities/user-role.enum'
import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
export class CreateUserDto {
  
    @IsNotEmpty()  
    username: string;

    @MinLength(12, { message: 'Password must be at least 12 characters long' })
    @MaxLength(30, { message: 'Password must not exceed 30 characters' })
    @IsNotEmpty()
    password: string;
    
    @IsNotEmpty()
    role:UserRole
  }
  