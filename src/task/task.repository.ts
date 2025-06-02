import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { TaskDocument, Tasks } from './schema/task.schema';
import { Task } from './entities/task.entity';
import { Model } from 'mongoose';
import { TaskDto } from './entities/task.dto';

@Injectable()
export class TaskRepository {
  constructor(
    @InjectModel(Tasks.name) private taskModule: Model<TaskDocument>,
  ) {}
  async getAll(): Promise<Task[]> {
    try {
      return await this.taskModule.find<Task>();
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
  async getByTitle(title: string): Promise<Task> {
    try {
      const task = await this.taskModule.findOne<Task>({ title });
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
}
