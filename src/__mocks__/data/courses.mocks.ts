import { CreateCourseDto } from 'src/courses/dto/create-course.dto';

export const mockedNewCourseId = () => ({
  id: '3620363c-d6c9-49b0-9b51-37df6015dc62',
});

export const mockedCreateCourseDtoCourseNotRequired: () => CreateCourseDto =
  () => ({
    name: 'Test Course',
    requiredCourse: null,
  });
