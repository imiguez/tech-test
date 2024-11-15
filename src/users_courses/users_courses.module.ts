import { Module } from '@nestjs/common';
import { UsersCoursesService } from './users_courses.service';
import { UsersCoursesController } from './users_courses.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersCourses } from './entities/users_courses.entity';
import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersCourses, Course, User])],
  exports: [TypeOrmModule],
  controllers: [UsersCoursesController],
  providers: [UsersCoursesService],
})
export class UsersCoursesModule {}
