import { TaskStatus } from './task.entity';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TaskDto {
  id: string;
  @IsString()
  @IsNotEmpty()
  title: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.PENDING])
  status: TaskStatus;
  private discount: number;
}
