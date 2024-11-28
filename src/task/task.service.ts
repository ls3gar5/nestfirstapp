import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './entities/task.entity';
import { taskDto } from './entities/task.dto';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty } from 'lodash';

@Injectable()
export class TaskService {

    private tasklist: Task [] = [
        { id: uuidv4(), title: 'Create a Budget', description: 'Build a new room', status: TaskStatus.PENDING } as Task
    ];

    async getMessage(): Promise<string> {
        return 'Hola Mundo!!';
    }
    async getAll(): Promise<Task[]> {
        return this.tasklist;
    }

    async create(task: taskDto): Promise<Task> {
        const newTaskdto = { id: uuidv4(), title: task.title, description: task.description, status: task.status };
        const newTask = new Task(newTaskdto);
        this.tasklist.push(newTask);
        return newTask;
    }

    async update(task: taskDto): Promise<Partial<Task>> {
        const updateTask = new Task(task);
        const disccount = updateTask.getDiscount();
        console.log(disccount);
        return updateTask;
    }

    async delete(id: string): Promise<Task> {
        
        const taskToDelete = this.tasklist.find( task => task.id === id);
        if(isEmpty(taskToDelete)) throw new NotFoundException('Task not found');
        
        this.tasklist = this.tasklist.filter( task => task.id !== id);

        return taskToDelete;
    }


}
