import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import request, { Response } from 'supertest';
import { mockedSignUpResponse } from 'src/__mocks__/data/auth.mocks';
import { INestApplication } from '@nestjs/common';

jest.mock('../auth.service');

describe('AuthController', () => {
  let app: INestApplication;
  let response: Response;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    jest.clearAllMocks();
    app = module.createNestApplication();
    await app.init();
    expect(module.get<AuthController>(AuthController)).toBeDefined();
  });

  afterEach(() => {
    expect(response.headers['content-type']).toMatch('application/json');
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('POST /sign-up', () => {
    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/auth/sign-up')
        .send({
          email: 'test@gmail.com',
          password: '123456',
        })
        .set('Accept', 'application/json');
    });

    it('should return a 201 status code', () => {
      expect(response.status).toEqual(201);
    });

    it('should return a User created message', () => {
      expect(response.body.message).toEqual('User created.');
    });

    it('should return an HttpOnly session cookie', () => {
      expect(
        response.headers['set-cookie'][0].includes(
          `session=${mockedSignUpResponse().session}; Max-Age=${mockedSignUpResponse().expiresIn / 1000};`,
        ),
      ).toBeTruthy();
      expect(
        response.headers['set-cookie'][0].includes('HttpOnly'),
      ).toBeTruthy();
    });
  });

  describe('POST /login', () => {
    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@gmail.com',
          password: '123456',
        })
        .set('Accept', 'application/json');
    });

    it('should return a 200 status code', () => {
      expect(response.status).toEqual(200);
    });

    it('should return a User logged message', () => {
      expect(response.body.message).toEqual('User logged.');
    });

    it('should return an HttpOnly session cookie', () => {
      expect(
        response.headers['set-cookie'][0].includes(
          `session=${mockedSignUpResponse().session}; Max-Age=${mockedSignUpResponse().expiresIn / 1000};`,
        ),
      ).toBeTruthy();
      expect(
        response.headers['set-cookie'][0].includes('HttpOnly'),
      ).toBeTruthy();
    });
  });
});
