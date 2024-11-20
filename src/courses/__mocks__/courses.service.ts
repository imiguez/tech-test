import { mockedNewCourseId } from 'src/__mocks__/data/courses.mocks';

export const CoursesService = jest.fn().mockReturnValue({
  create: jest.fn().mockResolvedValue(mockedNewCourseId().id),
});
