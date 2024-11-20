import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from '../courses.controller';
import { CoursesService } from '../courses.service';
import request, { Response } from 'supertest';
import {
  mockedCreateCourseDtoCourseNotRequired,
  mockedNewCourseId,
} from 'src/__mocks__/data/courses.mocks';
import { FirebaseAuthGuard } from '../../auth/guards/firebase.auth.guard';
import { INestApplication } from '@nestjs/common';

jest.mock('../courses.service');

describe('CoursesController', () => {
  let app: INestApplication;
  let response: Response;
  let firebaseAuthGuard: FirebaseAuthGuard;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [CoursesService],
    })
      .overrideGuard(FirebaseAuthGuard)
      .useClass(
        jest.fn().mockReturnValue({
          canActivate: jest.fn().mockResolvedValue(true),
        }),
      )
      .compile();

    jest.clearAllMocks();
    app = module.createNestApplication();
    await app.init();
    firebaseAuthGuard = app.get<FirebaseAuthGuard>(FirebaseAuthGuard);
    expect(module.get<CoursesController>(CoursesController)).toBeDefined();
  });

  afterEach(() => {
    expect(response.headers['content-type']).toMatch('application/json');
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('POST /create', () => {
    beforeAll(async () => {
      response = await request(app.getHttpServer())
        .post('/courses')
        .send(mockedCreateCourseDtoCourseNotRequired())
        .set('Accept', 'application/json');
    });

    it('should be invoked the firebase auth guard', () => {
      expect(firebaseAuthGuard.canActivate).toHaveBeenCalled();
    });

    it('should return a 201 status code', () => {
      expect(response.status).toEqual(201);
    });

    it('should return the created course id', () => {
      expect(response.body).toMatchObject(mockedNewCourseId());
    });
  });
});
