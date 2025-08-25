import {
  Controller,
  Get,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller({ path: 'task', version: '2' })
export class TaskV2Controller {
  constructor(private readonly taskservice: TaskService) { }

  @ApiQuery({
    name: 'version',
    required: false,
    description: 'API version',
    example: '2',
  })
  @Get()

  async message(): Promise<string> {
    return await this.taskservice.getMessage();
  }
}
