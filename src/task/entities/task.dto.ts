import { PartialType } from '@nestjs/swagger';
import { Task } from './task.entity';

export class TaskDto extends PartialType(Task) {}
