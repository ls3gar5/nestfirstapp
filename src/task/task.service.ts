import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './entities/task.entity';
import { taskDto } from './entities/task.dto';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty } from 'lodash';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}
  private tasklist: Task[] = [
    {
      id: '800e1205-e278-49ef-9f3a-3ef143d697bd',
      title: 'Create a Budget',
      description: 'Build a new room',
      status: TaskStatus.PENDING,
    } as Task,
  ];

  async getMessage(): Promise<string> {
    return this.taskRepository.getMessage();
  }
  async getAll(): Promise<Task[]> {
    return this.tasklist;
  }

  async create(task: taskDto): Promise<Task> {
    const newTaskdto = {
      id: uuidv4(),
      title: task.title,
      description: task.description,
      status: task.status,
    };
    const newTask = new Task(newTaskdto);
    this.tasklist.push(newTask);
    return newTask;
  }

  async update(id: string, task: taskDto): Promise<Task> {
    const taskToUpdate = this.tasklist.findIndex((t) => t.id === id);
    if (taskToUpdate === -1) throw new NotFoundException('Task not found');
    this.tasklist = this.tasklist.map((t) => {
      return t.id === id ? ({ ...t, ...task } as Task) : t;
    });
    const updatedTask = this.tasklist.find((t) => t.id === id);

    return updatedTask;
  }

  async delete(id: string): Promise<Task> {
    const taskToDelete = this.tasklist.find((task) => task.id === id);
    if (isEmpty(taskToDelete)) throw new NotFoundException('Task not found');

    this.tasklist = this.tasklist.filter((task) => task.id !== id);

    return taskToDelete;
  }
}
