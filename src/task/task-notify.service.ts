import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { TaskDto } from './entities/task.dto';
import { TaskService } from './task.service';
import { taskNotifyService } from './constant/task.contant';

@Injectable()
export class TaskNotifyService {

    constructor(private readonly taskService: TaskService) { }

    @OnEvent(taskNotifyService.TASK_CREATED_SERVICE)
    async notifyTask(taskTitle: string) {
        console.log('Event received at:', new Date().toISOString());
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log(`Task created: ${taskTitle}`, new Date().toISOString());
    }

    @OnEvent(taskNotifyService.TASK_STORE_SERVICE)
    async storedTask(task: TaskDto) {
        console.log('Event task.stored received at:', new Date().toISOString());
        await new Promise(resolve => setTimeout(resolve, 5000));
        try {
            await this.taskService.create(task);
        } catch (error) {
            console.error('Error storing task:', error);
            throw error;
        }

        console.log(`Task stored: ${task.title}`, new Date().toISOString());
    }
}
