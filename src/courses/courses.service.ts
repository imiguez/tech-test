import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private coursesRepository: Repository<Course>,
  ) {
    this.init();
  }

  private async init() {
    let c1 = await this.coursesRepository.findOneBy({ name: 'Course 1' });
    if (!c1) {
      c1 = new Course();
      c1.name = 'Course 1';
      c1 = await this.coursesRepository.save(c1);
    }

    let c1v2 = await this.coursesRepository.findOneBy({ name: 'Course 1.2' });
    if (!c1v2) {
      c1v2 = new Course();
      c1v2.name = 'Course 1.2';
      c1v2 = await this.coursesRepository.save(c1v2);
    }

    let c2 = await this.coursesRepository.findOneBy({ name: 'Course 2' });
    if (!c2) {
      c2 = new Course();
      c2.name = 'Course 2';
      c2.hierarchy = 1;
      c2.requiredCourse = c1;
      c2 = await this.coursesRepository.save(c2);
    }

    let c2v2 = await this.coursesRepository.findOneBy({ name: 'Course 2.2' });
    if (!c2v2) {
      c2v2 = new Course();
      c2v2.name = 'Course 2.2';
      c2v2.hierarchy = 1;
      c2v2.requiredCourse = c1;
      c2v2 = await this.coursesRepository.save(c2v2);
    }

    let c3 = await this.coursesRepository.findOneBy({ name: 'Course 3' });
    if (!c3) {
      c3 = new Course();
      c3.name = 'Course 3';
      c3.hierarchy = 2;
      c3.requiredCourse = c2;
      c3 = await this.coursesRepository.save(c3);
    }

    let c4 = await this.coursesRepository.findOneBy({ name: 'Course 4' });
    if (!c4) {
      c4 = new Course();
      c4.name = 'Course 4';
      c4.hierarchy = 3;
      c4.requiredCourse = c3;
      c4 = await this.coursesRepository.save(c4);
    }
  }

  async create(createCourseDto: CreateCourseDto): Promise<number> {
    try {
      const course = new Course();
      course.name = createCourseDto.name;
      if (createCourseDto.requiredCourse) {
        const requiredCourse = await this.coursesRepository.findOneByOrFail({
          id: createCourseDto.requiredCourse,
        });
        course.requiredCourse = requiredCourse;
        course.hierarchy = requiredCourse.hierarchy + 1;
      }
      const insertedCourse = await this.coursesRepository.insert(course);
      return insertedCourse.identifiers[0].id;
    } catch (error) {
      throw new InternalServerErrorException(
        'Error inserting course in the database.',
      );
    }
  }
}
