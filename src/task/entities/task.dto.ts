import { ApiProperty } from '@nestjs/swagger';
import { TaskStatus } from './task.entity';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TaskDto {
  @ApiProperty({ example: '1xxAAA-AAA-qsasa1' })
  id: string;

  @ApiProperty({ example: 'New task title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description: string;

  @ApiProperty({
    enum: TaskStatus,
    default: TaskStatus.PENDING,
  })
  @IsIn([TaskStatus.DONE, TaskStatus.IN_PROGRESS, TaskStatus.PENDING])
  status: TaskStatus;

  private discount: number;
}
