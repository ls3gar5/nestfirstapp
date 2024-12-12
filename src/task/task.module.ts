import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Tasks, TaskSchema } from './schema/task.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tasks.name, schema: TaskSchema }]),
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
})
export class TaskModule {}
