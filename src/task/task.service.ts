import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './entities/task.entity';
import { TaskDto } from './entities/task.dto';
import { v4 as uuidv4 } from 'uuid';
import { TaskRepository } from './task.repository';
import { provinceCodeDescription } from './utils/task.util';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { isEmpty, validate } from 'class-validator';

@Injectable()
export class TaskService {
  constructor(
    private readonly taskRepository: TaskRepository,
    // private readonly taskNotifyService: TaskNotifyService,
    private readonly eventEmitter: EventEmitter2,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
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
    // Try to get province from cache
    const cachedProvince: string = await this.cacheManager.get('province');
    Logger.log(`Cache value for province: ${cachedProvince}`);

    // Check if we have a valid cached value
    if (!isEmpty(cachedProvince)) {
      Logger.log('Returning cached province value');
      return cachedProvince;
    }

    // If no valid cache, proceed with normal flow
    const province = 'Ciudad de Buenos Aires';
    const provinceWithOutAccents = province
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
    const provinceWithOutSpaces = provinceWithOutAccents.replace(/ /g, '').trim();
    const jurisdictionCode = provinceCodeDescription[provinceWithOutSpaces] ?? 'No Province Code';

    // Store in cache with TTL of 600 seconds (10 minutes)
    await this.cacheManager.set('province', jurisdictionCode);

    this.eventEmitter.emit('task.created', 'New Task Created');
    Logger.log(`The jurisdiction code for ${province} is ${jurisdictionCode}`);
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
    const isTaskDtoValid = validate(taskDto);
    if (isEmpty(isTaskDtoValid)) throw new NotFoundException('Task data is not valid');
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
