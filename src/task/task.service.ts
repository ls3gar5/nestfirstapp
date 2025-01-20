import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './entities/task.entity';
import { TaskDto } from './entities/task.dto';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty } from 'lodash';
import { TaskRepository } from './task.repository';
import { StsService } from './STSService';
@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}
  private tasklist: Task[] = [
    {
      id: '800e1205-e278-49ef-9f3a-3ef143d697bd',
      title: 'Create a Budget 1',
      description: 'Build a new room',
      status: TaskStatus.PENDING,
    } as Task,
  ];

  async getMessage(): Promise<string> {
    return this.taskRepository.getMessage();
  }
  async getAll(): Promise<Task[]> {
    return this.taskRepository.getAll();
  }

  async processAll(): Promise<void> {
    const list = await this.taskRepository.getAll();

    await Promise.all(
      list.map(async (task: Task) => {
        const nro = await StsService.assumeRole();
        console.log(`task: ${task.id}, date.now: ${Date.now()},  role: ${nro}`);
      }),
    );
  }

  async create(taskDto: TaskDto): Promise<Task> {
    const newTask = {
      id: uuidv4(),
      title: taskDto.title,
      description: taskDto.description,
      status: taskDto.status,
    };
    const task = new Task(newTask);
    this.tasklist.push(task);

    await this.taskRepository.createTask(task);
    return task;
  }

  async update(id: string, task: TaskDto): Promise<Task> {
    const taskToUpdate = this.tasklist.findIndex((t) => t.id === id);
    if (taskToUpdate === -1) throw new NotFoundException('Task not found');

    // this.tasklist = this.tasklist.map((t) => {
    //   return t.id === id ? ({ ...t, ...task } as Task) : t;
    // });
    // const updatedTask = this.tasklist.find((t) => t.id === id);
    const updatedTask = await this.taskRepository.updateTask(id, task);

    return updatedTask;
  }

  async delete(id: string): Promise<Task> {
    const taskToDelete = this.tasklist.find((task) => task.id === id);
    if (isEmpty(taskToDelete)) throw new NotFoundException('Task not found');

    this.tasklist = this.tasklist.filter((task) => task.id !== id);

    return taskToDelete;
  }
}
