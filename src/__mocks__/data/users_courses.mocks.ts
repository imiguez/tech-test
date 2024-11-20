import { Course } from 'src/courses/entities/course.entity';
import { StudyPlanDto } from 'src/users_courses/dto/study-plan.dt';

const course1: () => Partial<Course> = () => ({
  id: '685ffcd3-6492-4d7d-9c57-c6d6c34a4ec3',
  name: 'Test Course 1',
  requiredCourse: null,
  hierarchy: 0,
});

const course2: () => Partial<Course> = () => ({
  id: 'bed07072-2842-4e77-86e6-aaf8c4ea4f2c',
  name: 'Test Course 1.2',
  requiredCourse: null,
  hierarchy: 0,
});

export const mockedNewUserCourse = () => ({
  userId: '771f7bc5-08f9-43da-ba67-71ec17804783',
  courseId: '961d6e05-9de9-47b1-a0f5-af7f3c292669',
  completed: false,
});

export const mockedUpdatedUserCourse = () => ({
  userId: '771f7bc5-08f9-43da-ba67-71ec17804783',
  courseId: '961d6e05-9de9-47b1-a0f5-af7f3c292669',
  completed: true,
});

export const mockedStudyPlanDto: () => StudyPlanDto = () => ({
  userId: '771f7bc5-08f9-43da-ba67-71ec17804783',
  courses: [
    '685ffcd3-6492-4d7d-9c57-c6d6c34a4ec3', // Course 1
    'fba77af1-ee3e-400a-9c4e-c54e43ef0832', // Course 2
    'bed07072-2842-4e77-86e6-aaf8c4ea4f2c', // Course 1.2
    '108a6efc-51e0-49fc-ae72-931eb9bc94ff', // Course 2.2
    '961d6e05-9de9-47b1-a0f5-af7f3c292669', // Course 3
    '771f7bc5-08f9-43da-ba67-71ec17804783', // Course 4
  ],
});

export const mockedStudyPlan: () => Partial<Course>[] = () => [course1()];

export const mockedAvailableCourses: () => Partial<Course>[] = () => [
  course1(),
  course2(),
];

export const mockedAllCourses: () => Partial<Course>[] = () => [
  course1(),
  course2(),
];
