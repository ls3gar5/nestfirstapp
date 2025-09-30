import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class TaskNotifyService {
    @OnEvent('task.created')
    async notifyTask(taskTitle: string) {
        console.log('Event received at:', new Date().toISOString());
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log(`Task created: ${taskTitle}`, new Date().toISOString());
    }
}
