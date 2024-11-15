import { Test, TestingModule } from '@nestjs/testing';
import { UsersCoursesService } from '../users_courses.service';
import { UsersCoursesController } from '../users_courses.controller';

describe('UsersCoursesController', () => {
  let controller: UsersCoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersCoursesController],
      providers: [UsersCoursesService],
    }).compile();

    controller = module.get<UsersCoursesController>(UsersCoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
