/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUsersCourseDto } from './dto/create-users_course.dto';
import { UpdateUsersCourseDto } from './dto/update-users_course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersCourses } from './entities/users_courses.entity';
import { Repository } from 'typeorm';
import { StudyPlanDto } from './dto/study-plan.dt';
import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entities/user.entity';
import { User as GuardUser } from 'src/auth/guards/firebase.auth.guard';

export type StudyPlan = {
  course: Course;
  completed?: boolean;
}[];

@Injectable()
export class UsersCoursesService {
  constructor(
    @InjectRepository(UsersCourses)
    private usersCoursesRepository: Repository<UsersCourses>,
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    setTimeout(async () => {
      try {
        await this.init();
      } catch (error) {
        console.log('Error pre-loading users_courses data.');
      }
    }, 2000);
  }

  private async init() {
    const userCourse = new UsersCourses();
    userCourse.completed = true;
    userCourse.course = await this.coursesRepository.findOneBy({
      hierarchy: 0,
    });
    userCourse.user = await this.usersRepository.findOneBy({
      email: 'test@gmail.com',
    });
    if (
      !(await this.usersCoursesRepository.findOneBy({
        user: userCourse.user,
        course: userCourse.course,
      }))
    )
      await this.usersCoursesRepository.insert(userCourse);

    const userCourse2 = new UsersCourses();
    userCourse2.course = await this.coursesRepository.findOneBy({
      requiredCourse: userCourse.course,
      name: 'Course 2',
    });
    userCourse2.user = userCourse.user;
    if (
      !(await this.usersCoursesRepository.findOneBy({
        user: userCourse2.user,
        course: userCourse2.course,
      }))
    )
      await this.usersCoursesRepository.insert(userCourse2);
  }

  async create(
    createUsersCourseDto: CreateUsersCourseDto,
  ): Promise<{ userId: string; courseId: string }> {
    try {
      return (await this.usersCoursesRepository.insert(createUsersCourseDto))
        .identifiers[0] as { userId: string; courseId: string };
    } catch (error) {
      if (
        error.message &&
        error.message.includes(
          `violates unique constraint "unique_incomplete_course_per_user"`,
        )
      )
        throw new ConflictException(
          'A user can take only one course at a time.',
        );
      throw new InternalServerErrorException(
        'Error trying to create relation between user and course.',
      );
    }
  }

  async createStudyPlan(studyPlanDto: StudyPlanDto): Promise<Course[]> {
    try {
      const coursesDone = (
        await this.usersCoursesRepository
          .createQueryBuilder('users_courses')
          .leftJoinAndSelect('users_courses.course', 'course')
          .select(['course', 'users_courses.completed'])
          .where('users_courses.userId = :userId', {
            userId: studyPlanDto.userId,
          })
          .andWhere('users_courses.completed = :completed', { completed: true })
          .getMany()
      ).map((course) => course.course.id);

      let coursesAvailable;

      if (coursesDone.length == 0) {
        coursesAvailable = await this.coursesRepository
          .createQueryBuilder('course')
          .where('course.id IN (:...ids)', { ids: [...studyPlanDto.courses] })
          .andWhere('course.requiredCourse IS NULL')
          .getMany();
      } else {
        coursesAvailable = await this.coursesRepository
          .createQueryBuilder('course')
          .where('course.id IN (:...ids)', { ids: [...studyPlanDto.courses] })
          .andWhere(
            '(course.requiredCourse IN (:...requiredCourses) OR course.requiredCourse IS NULL)',
            { requiredCourses: [...coursesDone] },
          )
          .orderBy('course.hierarchy', 'ASC')
          .getMany();
      }

      return coursesAvailable;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error trying to create study plan.',
      );
    }
  }

  async getAvailableCoursesFromUser(user: GuardUser): Promise<Course[]> {
    try {
      const dbUser = await this.usersRepository.findOneByOrFail({
        email: user.email,
      });

      const coursesDoneAndInProgress = await this.usersCoursesRepository
        .createQueryBuilder('users_courses')
        .leftJoinAndSelect('users_courses.course', 'course')
        .select(['course.id', 'users_courses.completed'])
        .where('users_courses.userId = :userId', {
          userId: dbUser.id,
        })
        .getMany();

      const coursesDone = coursesDoneAndInProgress
        .filter((course) => course.completed)
        .map((course) => course.course.id);

      let coursesAvailable;
      if (coursesDone.length == 0) {
        if (coursesDoneAndInProgress.length == 0) {
          coursesAvailable = await this.coursesRepository
            .createQueryBuilder('course')
            .andWhere('course.requiredCourse IS NULL')
            .getMany();
        } else {
          coursesAvailable = await this.coursesRepository
            .createQueryBuilder('course')
            .where('course.id NOT IN (:...ids)', {
              ids: [
                ...coursesDoneAndInProgress.map((course) => course.course.id),
              ],
            })
            .andWhere('course.requiredCourse IS NULL')
            .getMany();
        }
      } else {
        coursesAvailable = await this.coursesRepository
          .createQueryBuilder('course')
          .where('course.id NOT IN (:...ids)', {
            ids: [
              ...coursesDoneAndInProgress.map((course) => course.course.id),
            ],
          })
          .andWhere(
            '(course.requiredCourse IN (:...requiredCourses) OR course.requiredCourse IS NULL)',
            { requiredCourses: [...coursesDone] },
          )
          .orderBy('course.hierarchy', 'ASC')
          .getMany();
      }

      return coursesAvailable;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error getting courses available.',
      );
    }
  }

  async findAll(): Promise<Course[]> {
    try {
      return await this.coursesRepository.find();
    } catch (error) {
      throw new InternalServerErrorException(
        'Error fetching all users_courses.',
      );
    }
  }

  async update(updateUsersCourseDto: UpdateUsersCourseDto): Promise<number> {
    try {
      return (
        await this.usersCoursesRepository.update(
          {
            userId: updateUsersCourseDto.userId,
            courseId: updateUsersCourseDto.courseId,
          },
          updateUsersCourseDto,
        )
      ).affected;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error trying to update users_courses.',
      );
    }
  }
}
