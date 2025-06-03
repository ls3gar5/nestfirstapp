import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './entities/task.dto';
import { Task } from './entities/task.entity';

@Controller({ path: 'task', version: '1' })
export class TaskController {
  constructor(private readonly taskservice: TaskService) {}

  @Get()
  async message(): Promise<string> {
    return await this.taskservice.getMessage();
  }

  @Get('list')
  async allTasks(): Promise<Task[]> {
    return await this.taskservice.getAll();
  }

  @Get('title/:title')
  async getByTitle(@Param('title') title: string): Promise<Task> {
    return await this.taskservice.getByTitle(title);
  }


  @Post()
  @HttpCode(201)
  async create(@Body() newtask: TaskDto): Promise<Task> {
    return await this.taskservice.create(newtask);
  }

  @Patch(':id')
  @HttpCode(202)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTask: TaskDto,
  ): Promise<Task> {
    return await this.taskservice.update(id, updateTask);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Task> {
    return this.taskservice.delete(id);
  }
}
