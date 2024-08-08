import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { Task } from '../task/entities/task.entity';
import { CreateTaskDto } from '../task/dto/create-task.dto';
import { User } from '../user/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Taskstatus } from './entities/task-status.enum';
import { UserRole } from '../user/entities/user-role.enum';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let taskRepository: Repository<Task>;
  let userRepository: Repository<User>;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    taskRepository = moduleFixture.get<Repository<Task>>(getRepositoryToken(Task));
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

     
    const user = await userRepository.save({
      username: 'admin',
      password: await bcrypt.hash('admin', 10),
      role: UserRole.USER,
    });

    const signinResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ username: 'admin', password: 'admin' })
      .expect(201); 

    accessToken = signinResponse.body.access_token;
  });

  afterEach(async () => {
   
    await taskRepository.query('SET FOREIGN_KEY_CHECKS = 0');  
    await taskRepository.query('DELETE FROM task'); 
    await taskRepository.query('SET FOREIGN_KEY_CHECKS = 1');  
    await userRepository.query('SET FOREIGN_KEY_CHECKS = 0');  
    await userRepository.query('DELETE FROM user');  
    await userRepository.query('SET FOREIGN_KEY_CHECKS = 1');  
  });

  it('/task (POST) should create a task', async () => {
    const createTaskDto: CreateTaskDto = { title: 'New Task', description: 'Task Description',status:Taskstatus.PENDING };

    const response = await request(app.getHttpServer())
      .post('/task')
      .set('Authorization', `Bearer ${accessToken}`)
      .send(createTaskDto)
      .expect(201);  
 
    console.log('Create Task Response:', response.body);

     expect(response.body).toEqual(expect.objectContaining(createTaskDto));
  });

  it('/task/:id (GET) should return a task by ID', async () => {
    
    const createdTask = await taskRepository.save({
      title: 'Test Task',
      description: 'Test Description',
    });

    const response = await request(app.getHttpServer())
      .get(`/task/${createdTask.id}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200); 

     console.log('Get Task Response:', response.body);

    
    expect(response.body).toEqual(expect.objectContaining(createdTask));
  });

  afterAll(async () => {
    await app.close();
  });
});
