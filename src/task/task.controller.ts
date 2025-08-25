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
  UseFilters,
  ValidationPipe,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './entities/task.dto';
import { Task } from './entities/task.entity';
import { ApiTags } from '@nestjs/swagger';
import { CustomNotFoundException } from '../handler/error.handler';
import { formattedMessage } from './task.util';

@Controller({ path: 'task', version: '1' })
export class TaskController {
  constructor(private readonly taskservice: TaskService) { }

  @Get()
  async message(): Promise<string> {
    formattedMessage('test');
    return await this.taskservice.getMessage();
  }

  @Get('list')
  async allTasks(): Promise<Task[]> {
    return await this.taskservice.getAll();
  }

  @Get('title/:title')
  @ApiTags('Get task tittle!!')
  @HttpCode(210)
  @UseFilters(CustomNotFoundException)
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
