import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put } from '@nestjs/common';
import { TaskService } from './task.service';
import { taskDto } from './entities/task.dto';
import { Task } from './entities/task.entity';

@Controller('task')
export class TaskController {

    constructor(private readonly taskservice: TaskService) {}

    @Get()
    async message(): Promise<string>{
        return await this.taskservice.getMessage();
    }

    @Get('list')
    async allTasks(): Promise<Task[]>{
        return await this.taskservice.getAll();
    }

    @Post()
    @HttpCode(201)
    async create(@Body() newtask: taskDto): Promise<Task> {
        return await this.taskservice.create(newtask);
    }

    @Patch(':id')
    @HttpCode(202)
    async update(@Param('id') id: string, @Body() updateTask: taskDto): Promise<Task> {
        return await this.taskservice.update(id, updateTask);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<Task> {
        return this.taskservice.delete(id);
    }    
}
