import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskDocument, Tasks } from './schema/task.schema';
import { Task } from './entities/task.entity';
import { Model } from 'mongoose';
import { TaskDto } from './entities/task.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as fs from 'node:fs/promises';

@Injectable()
export class TaskRepository {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    @InjectModel(Tasks.name) private taskModule: Model<TaskDocument>,
  ) { }
  async getAll(): Promise<Task[]> {
    try {
      const results = await this.taskModule.find();
      if (!results) {
        return [];
      }
      return results.map(result => new Task(result));
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async getByTitle(title: string): Promise<Task> {
    try {
      // Check if key exists
      const cachedTask = await this.cacheManager.get<Task>('task');
      if (cachedTask) {
        console.log('Returning cached task');
        return cachedTask;
      }
      // If not cached, fetch from the database
      const task = await this.taskModule.findOne<Task>({ title });

      await this.cacheManager.set<Task>('task', task);

      return task;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async delete(id: string): Promise<Task> {
    try {
      const result = await this.taskModule.findByIdAndDelete(id);
      if (!result) {
        throw new InternalServerErrorException('Task not found');
      }
      return new Task(result);
    }
    catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async createTask(newTask: Task): Promise<Task> {
    try {
      const result = await this.taskModule.create(newTask);
      return new Task(result);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async updateTask(id: string, task: TaskDto): Promise<Task> {
    try {
      const result: Task = await this.taskModule.findByIdAndUpdate(id, task);
      return result;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  getMessage(): string {
    return 'Its working ok!';
  }

  async readFile(): Promise<string> {
    {
      try {
        const data = await fs.readFile('./src/task/data.json', 'utf8');
        return data;
      } catch (error) {
        throw new InternalServerErrorException(error.message);
      }
    }
  }
}
