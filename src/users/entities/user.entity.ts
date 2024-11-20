import { UsersCourses } from 'src/users_courses/entities/users_courses.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @OneToMany(() => UsersCourses, (usersCourses) => usersCourses.user, {
    lazy: true,
  })
  usersCourses: UsersCourses[];
}
