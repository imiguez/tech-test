import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { FirebaseAuthGuard } from 'src/auth/guards/firebase.auth.guard';

@UseGuards(FirebaseAuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async create(
    @Body() createCourseDto: CreateCourseDto,
  ): Promise<{ id: string }> {
    const id = await this.coursesService.create(createCourseDto);
    return { id };
  }
}
