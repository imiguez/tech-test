import { Controller, Get, Post, Body, Put, Req } from '@nestjs/common';
import { UsersCoursesService } from './users_courses.service';
import { CreateUsersCourseDto } from './dto/create-users_course.dto';
import { UpdateUsersCourseDto } from './dto/update-users_course.dto';
import { StudyPlanDto } from './dto/study-plan.dt';
import { Course } from 'src/courses/entities/course.entity';
import { ReqWithUser } from 'src/auth/guards/firebase.auth.guard';

@Controller('user-courses')
export class UsersCoursesController {
  constructor(private readonly usersCoursesService: UsersCoursesService) {}

  @Post()
  async create(
    @Body() createUsersCourseDto: CreateUsersCourseDto,
  ): Promise<number> {
    return await this.usersCoursesService.create(createUsersCourseDto);
  }

  @Post('study-plan')
  async createStudyPlan(@Body() studyPlanDto: StudyPlanDto): Promise<Course[]> {
    return await this.usersCoursesService.createStudyPlan(studyPlanDto);
  }

  @Get('available')
  async getAvailableCoursesFromUser(
    @Req() req: ReqWithUser,
  ): Promise<Course[]> {
    return await this.usersCoursesService.getAvailableCoursesFromUser(req.user);
  }

  @Get()
  async findAll(): Promise<Course[]> {
    return await this.usersCoursesService.findAll();
  }

  @Put()
  async update(@Body() updateUsersCourseDto: UpdateUsersCourseDto) {
    const response =
      await this.usersCoursesService.update(updateUsersCourseDto);
    return { updated: !!response.affected };
  }
}
