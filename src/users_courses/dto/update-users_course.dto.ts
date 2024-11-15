import { OmitType } from '@nestjs/mapped-types';
import { CreateUsersCourseDto } from './create-users_course.dto';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class UpdateUsersCourseDto extends OmitType(CreateUsersCourseDto, [
  'completed',
] as const) {
  @IsBoolean()
  @IsNotEmpty()
  completed: boolean;
}
