import { IsArray, IsString } from 'class-validator';

export class StudyPlanDto {
  @IsString()
  userId: string;
  @IsArray()
  courses: string[];
}
