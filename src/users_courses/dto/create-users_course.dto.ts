import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUsersCourseDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
  @IsString()
  @IsNotEmpty()
  courseId: string;
  @IsBoolean()
  @IsOptional()
  completed?: boolean;
}
