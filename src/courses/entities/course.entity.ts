import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersCourses } from 'src/users_courses/entities/users_courses.entity';

@Entity()
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @ManyToOne(() => Course, (course) => course.requiredCourses, {
    nullable: true,
  })
  requiredCourse: Course;

  @OneToMany(() => Course, (course) => course.requiredCourse)
  requiredCourses: Course[];

  @Column({ type: 'int', default: 0 })
  hierarchy: number;

  @OneToMany(() => UsersCourses, (usersCourses) => usersCourses.course, {
    lazy: true,
  })
  usersCourses: UsersCourses[];
}
