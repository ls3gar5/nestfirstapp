import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
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

    @Post()
    @HttpCode(201)
    async create(@Body() newtask: taskDto): Promise<Task> {
        return await this.taskservice.create(newtask);
    }



    
}
