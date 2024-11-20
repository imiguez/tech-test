import { Test, TestingModule } from '@nestjs/testing';
import { UsersCoursesService } from '../users_courses.service';
import { UsersCoursesController } from '../users_courses.controller';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase.auth.guard';
import request, { Response } from 'supertest';
import {
  mockedAllCourses,
  mockedAvailableCourses,
  mockedNewUserCourse,
  mockedStudyPlan,
  mockedStudyPlanDto,
  mockedUpdatedUserCourse,
} from 'src/__mocks__/data/users_courses.mocks';
import { INestApplication } from '@nestjs/common';

jest.mock('../users_courses.service');

describe('UsersCoursesController', () => {
  let app: INestApplication;
  let response: Response;
  let firebaseAuthGuard: FirebaseAuthGuard;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersCoursesController],
      providers: [UsersCoursesService],
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
    expect(
      module.get<UsersCoursesController>(UsersCoursesController),
    ).toBeDefined();
  });

  afterEach(() => {
    expect(response.headers['content-type']).toMatch('application/json');
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await app.close();
  });

  describe('Protected routes with Firebase authentication', () => {
    afterEach(() => {
      expect(firebaseAuthGuard.canActivate).toHaveBeenCalled();
    });

    describe('POST /create', () => {
      beforeAll(async () => {
        response = await request(app.getHttpServer())
          .post('/user-courses')
          .send(mockedNewUserCourse());
      });

      it('should return a 201 status code', () => {
        expect(response.status).toEqual(201);
      });

      it('should return an object with the new users_courses relation id (userId and courseId)', () => {
        const { userId, courseId } = mockedNewUserCourse();
        expect(response.body).toMatchObject({ userId, courseId });
      });
    });

    describe('POST /study-plan', () => {
      beforeAll(async () => {
        response = await request(app.getHttpServer())
          .post('/user-courses/study-plan')
          .send(mockedStudyPlanDto());
      });

      it('should return a 201 status code', () => {
        expect(response.status).toEqual(201);
      });

      // TODO: create different test scenarios.
      it('should return a study plan', () => {
        expect(response.body).toMatchObject(mockedStudyPlan());
      });
    });

    describe('GET /available', () => {
      beforeAll(async () => {
        response = await request(app.getHttpServer()).get(
          '/user-courses/available',
        );
      });

      it('should return a 200 status code', () => {
        expect(response.status).toEqual(200);
      });

      it('should return all the available courses to the user', () => {
        expect(response.body).toMatchObject(mockedAvailableCourses());
      });
    });

    describe('GET /user-courses', () => {
      beforeAll(async () => {
        response = await request(app.getHttpServer()).get('/user-courses');
      });

      it('should return a 200 status code', () => {
        expect(response.status).toEqual(200);
      });

      it('should return all the courses', () => {
        expect(response.body).toMatchObject(mockedAllCourses());
      });
    });

    describe('PUT /user-courses', () => {
      beforeAll(async () => {
        response = await request(app.getHttpServer())
          .put('/user-courses')
          .send(mockedUpdatedUserCourse());
      });

      it('should return a 201 status code', () => {
        expect(response.status).toEqual(201);
      });

      it('should return an object indicating that the update was made', () => {
        expect(response.body).toMatchObject({ updated: true });
      });
    });
  });
});
