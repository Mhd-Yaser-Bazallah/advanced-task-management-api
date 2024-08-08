import * as request from 'supertest';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/signup (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'testuser',
        password: 'password',
      })
      .expect(201);
  });

  it('/auth/signin (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send({
        username: 'testuser',
        password: 'password',
      })
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('access_token');
      });
  });

  

  afterAll(async () => {
    await app.close();
  });
});
