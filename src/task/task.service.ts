import { Injectable } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { taskDto } from './entities/task.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TaskService {


    async getMessage(): Promise<string> {
        return 'Hola Mundo!!';
    }
    async getAll(): Promise<string[]> {
        return ['Hola Mundo!!'];
    }

    async create(task: taskDto): Promise<Task> {
        const newTask = { id: uuidv4(), title: task.title, description: task.description } as Task;
        return new Task(newTask);
    }

    async update(task: taskDto): Promise<Partial<Task>> {
        const updateTask = new Task(task);
        const disccount = updateTask.getDiscount();
        console.log(disccount);
        return updateTask;
    }

    async delete(id: number): Promise<boolean> {
        return id > 100 ? false : true;
    }


}
