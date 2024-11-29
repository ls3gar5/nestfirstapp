import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { isEmpty } from 'lodash';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class Task {
  id: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;
  @IsString()
  @IsOptional()
  description: string;
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.PENDING])
  status: TaskStatus;
  private discount: number;

  constructor(taskDto: Partial<Task>) {
    this.id = taskDto.id;
    this.title = taskDto.title;
    this.description = taskDto.description;
    this.status = isEmpty(taskDto.status) ? TaskStatus.PENDING : taskDto.status;
    this.discount = 50;
  }

  getDiscount(): number {
    return this.status == TaskStatus.IN_PROGRESS ? this.discount : 10;
  }
}
