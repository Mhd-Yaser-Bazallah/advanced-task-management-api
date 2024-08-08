import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TaskModule } from './task/task.module';
import { User } from './user/entities/user.entity';
import { Task } from './task/entities/task.entity';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',  
      host: 'localhost',
      port: 3306,  
      username: 'root',  
      password: '1234', 
      database:'advanced_task_management_api',  //'TEST',
      entities: [User, Task],  
      //synchronize: true,  
    }),
    UserModule,
    TaskModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
