import { Logger, Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { TaskRepository } from './task.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Tasks, TaskSchema } from './schema/task.schema';
import { TaskV2Controller } from './task.v2.controller';
import { TaskNotifyService } from './task.notify.service';
import { AudioProcessor } from 'src/procesor/audio.procesor';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tasks.name, schema: TaskSchema }]),
    BullModule.registerQueue({
      name: 'audio',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: {
          count: 3,
        },
      }
    }),
  ],
  controllers: [TaskController, TaskV2Controller],
  providers: [TaskService, TaskRepository, Logger, TaskNotifyService, AudioProcessor],
})
export class TaskModule { }
