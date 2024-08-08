import{UserRole}from './../entities/user-role.enum'
import { IsNotEmpty } from 'class-validator';
export class CreateUserDto {
  
    @IsNotEmpty()  
    username: string;
    
    @IsNotEmpty()
    password: string;
    
    @IsNotEmpty()
    role:UserRole
  }
  