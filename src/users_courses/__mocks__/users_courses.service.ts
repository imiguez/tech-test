import {
  mockedAllCourses,
  mockedAvailableCourses,
  mockedNewUserCourse,
  mockedStudyPlan,
} from 'src/__mocks__/data/users_courses.mocks';

const { userId, courseId } = mockedNewUserCourse();

export const UsersCoursesService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue({ userId, courseId }),
  createStudyPlan: jest.fn().mockResolvedValue(mockedStudyPlan()),
  getAvailableCoursesFromUser: jest
    .fn()
    .mockResolvedValue(mockedAvailableCourses()),
  findAll: jest.fn().mockResolvedValue(mockedAllCourses()),
  update: jest.fn().mockResolvedValue(1),
});
