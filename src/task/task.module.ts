import { Logger, Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Tasks, TaskSchema } from './schema/task.schema';
import { TaskV2Controller } from './task.v2.controller';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true, // Makes CacheModule available everywhere
      ttl: 600, // seconds
      max: 1000, // maximum number of items in cache
    }),
    CacheModule.register({
      isGlobal: true, // Makes CacheModule available everywhere
      ttl: 600, // seconds
      max: 1000, // maximum number of items in cache
    }),
    MongooseModule.forFeature([{ name: Tasks.name, schema: TaskSchema }]),
  ],
  controllers: [TaskController, TaskV2Controller],
  providers: [TaskService, TaskRepository, Logger],
})
export class TaskModule { }
