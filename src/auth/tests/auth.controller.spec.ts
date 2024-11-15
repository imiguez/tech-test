import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { fn } from 'jest-mock';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { Response } from 'express';
import httpMocks from 'node-mocks-http';
import { UsersModule } from 'src/users/users.module';
import { FirebaseModule } from 'src/firebase/firebase.module';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('AuthController', () => {
  let controller: AuthController;

  const mockedAuthService = {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    login: fn((createAuthDto: CreateAuthDto) => ({
      session: 'mocked_session',
      expiresIn: 60 * 15 * 1000,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, FirebaseModule, TypeOrmModule],
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockedAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('succesful login should return a User logged message', () => {
    const mockExpressResponse = httpMocks.createResponse<Response>();
    expect(
      controller.login(mockExpressResponse, {
        email: 'test@gmail.com',
        password: '123456',
      }),
    ).toEqual('User logged.');
    expect(mockExpressResponse.cookies.session).toBe('mocked_session');
  });
});
