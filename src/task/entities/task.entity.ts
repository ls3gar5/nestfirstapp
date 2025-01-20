import {
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { isEmpty } from 'lodash';
import { TaskDto } from './task.dto';
import { ApiProperty } from '@nestjs/swagger';

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class Task {
  @ApiProperty()
  id: string;

  @ApiProperty({ example: 'Task title' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.PENDING])
  status: TaskStatus;
  private discount: number;

  constructor(taskDto: Partial<TaskDto>) {
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
