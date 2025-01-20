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
} from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './entities/task.dto';
import { Task } from './entities/task.entity';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('task')
export class TaskController {
  constructor(private readonly taskservice: TaskService) {}

  @ApiOperation({
    summary:
      'Get a message from the server. This is a simple example of a GET request',
  })
  @ApiResponse({
    status: 200,
    description: 'Return a message from the server',
    example: 'Its working ok! example!',
    type: String,
  })
  @Get()
  async message(): Promise<string> {
    return await this.taskservice.getMessage();
  }

  @ApiOperation({
    summary: 'Get a list of all tasks, without any filter. (mongodb)',
  })
  @ApiOkResponse({ type: Task, isArray: true })
  @ApiResponse({ status: 500, description: 'Error getting the list of tasks' })
  @Get('list')
  async allTasks(): Promise<Task[]> {
    return await this.taskservice.getAll();
  }

  @ApiOperation({
    summary:
      'Get a list of all tasks, without any filter. (mongodb), and ger a token without repeating',
  })
  @ApiOkResponse({ description: 'Return void' })
  @ApiResponse({ status: 500, description: 'Error getting the list of tasks' })
  @Get('runall')
  async processTasks(): Promise<void> {
    await this.taskservice.processAll();
  }

  @ApiOperation({
    summary: 'Create a new task',
  })
  @ApiCreatedResponse({ description: 'Task was created' })
  @ApiResponse({
    status: 500,
    description: 'Error updating the tasks',
    type: Task,
  })
  @Post()
  @HttpCode(201)
  async create(@Body() newtask: TaskDto): Promise<Task> {
    return await this.taskservice.create(newtask);
  }

  @ApiOperation({
    summary: 'Update a new task',
  })
  @ApiResponse({ status: 202, description: 'Task was updated', type: Task })
  @ApiResponse({ status: 500, description: 'Error updating the tasks' })
  @Patch(':id')
  @HttpCode(202)
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTask: TaskDto,
  ): Promise<Task> {
    return await this.taskservice.update(id, updateTask);
  }

  @ApiOperation({
    summary: 'Delete a new task by id',
  })
  @ApiResponse({ status: 200, description: 'Task was deleted', type: Task })
  @ApiResponse({ status: 500, description: 'Error deleting the tasks' })
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Task> {
    return this.taskservice.delete(id);
  }
}
