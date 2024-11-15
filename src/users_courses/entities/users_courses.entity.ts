import { Course } from 'src/courses/entities/course.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, PrimaryColumn, ManyToOne, Column, Index } from 'typeorm';

@Entity()
@Index('unique_incomplete_course_per_user', ['userId'], {
  where: 'completed = false',
  unique: true,
})
export class UsersCourses {
  @PrimaryColumn()
  userId: string;
  @PrimaryColumn()
  courseId: string;

  @ManyToOne(() => User, (user) => user.usersCourses)
  user: User;

  @ManyToOne(() => Course, (course) => course.usersCourses)
  course: Course;

  @Column({ default: false })
  completed: boolean;
}
