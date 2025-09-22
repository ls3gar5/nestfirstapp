import { Inject, Injectable, InternalServerErrorException, Logger, LoggerService, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './entities/task.entity';
import { TaskDto } from './entities/task.dto';
import { v4 as uuidv4 } from 'uuid';
import { isEmpty } from 'lodash';
import { TaskRepository } from './task.repository';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
  ) { }
  // this way is when the logger is not a provider.
  // private readonly logger = new Logger(TaskService.name);

  // @Inject(Logger) private readonly logger: LoggerService;

  private tasklist: Task[] = [
    {
      id: '800e1205-e278-49ef-9f3a-3ef143d697bd',
      title: 'Create a Budget 1',
      description: 'Build a new room',
      status: TaskStatus.PENDING,
    } as Task,
  ];

  async getMessage(): Promise<string> {
    // Logger.log('Getting message from TaskService');
    // Logger.warn('This is a warning message');
    // Logger.error('This is an error message');
    // throw new InternalServerErrorException('This is a test message');
    return this.taskRepository.getMessage();
  }

  async getByTitle(title: string): Promise<Task> {
    // const dataFile = await this.taskRepository.readFile();
    // if (isEmpty(dataFile)) throw new NotFoundException('File not found');
    const task = await this.taskRepository.getByTitle(title);
    if (isEmpty(task)) throw new NotFoundException('Task not found');
    return task;
  }

  async getAll(): Promise<Task[]> {
    return await this.taskRepository.getAll();
  }

  async create(taskDto: TaskDto): Promise<Task> {
    const task = new Task({
      id: uuidv4(),
      title: taskDto.title,
      description: taskDto.description,
      status: taskDto.status,
    });
    this.tasklist.push(task);

    const taskCreated = await this.taskRepository.createTask(task);
    return taskCreated;
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
