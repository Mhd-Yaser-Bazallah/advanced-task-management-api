import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtAuthGuard } from './../auth/JwtAuthGuard';  
import { JwtPayload } from './../auth/jwt.payload';   


@Injectable()
export class RolesGuard extends JwtAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {
    super(); 
  } 
  
   
  async CanActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
        
      return true; 
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;   
    
    if (!user || !user.role) {
      throw new ForbiddenException('Access denied');
    }

    return requiredRoles.includes(user.role);
  }
}
