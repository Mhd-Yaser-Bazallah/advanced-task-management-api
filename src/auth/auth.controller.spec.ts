import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';
import { AuthService } from '../auth/auth.service';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserRole } from '../user/entities/user-role.enum';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userRepository: Repository<User>;
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    authService = moduleFixture.get<AuthService>(AuthService);
    userRepository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    // Create a user and sign in to get an access token
    const user = await userRepository.save({
      username: 'admin',
      password: await bcrypt.hash('admin', 10),
      role: UserRole.ADMIN,
    });

    const signinResponse = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ username: 'admin', password: 'admin' })
      .expect(201); // Adjusted expected status to 201

    accessToken = signinResponse.body.access_token;
  });

  afterEach(async () => {
    // Clear the user table between tests
    await userRepository.query('SET FOREIGN_KEY_CHECKS = 0'); // Disable foreign key checks
    await userRepository.query('DELETE FROM user'); // Delete all users
    await userRepository.query('SET FOREIGN_KEY_CHECKS = 1'); // Re-enable foreign key checks
  });

  it('/auth/signup (POST) should sign up a new user', async () => {
    const createUserDto: CreateUserDto = { username: 'newuser', password: 'password', role: UserRole.USER };

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(createUserDto)
      .expect(201);

    // Log response for debugging
    console.log('Signup Response:', response.body);

    // Check if the response contains an access token and does not include the password
    expect(response.body).toHaveProperty('access_token');
    expect(response.body).not.toHaveProperty('password');
  });

  afterAll(async () => {
    await app.close();
  });
});
