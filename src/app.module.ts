import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter, CustomNotFoundException } from './handler/error.handler';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
// import { ServerResponse, IncomingMessage } from 'http';
import { getOrCreateNonce } from './task/utils/task.util';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DeviceController } from './device/device.controller';
import { BullModule } from '@nestjs/bullmq';
import { AudioProcessor } from './procesor/audio.procesor';
import { Tasks, TaskSchema } from './task/schema/task.schema';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true, // Makes CacheModule available everywhere
      ttl: 60000, // milliseconds    
      max: 100, // maximum number of items in cache
      store: 'memory', // default store
      // You can also use other stores like 'redis' or 'ioredis' if configured
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available everywhere
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGOURL),
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'audio',
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: {
          count: 3,
        },
      }
    }),
    EventEmitterModule.forRoot({
    }),
    TaskModule,
  ],
  providers: [{
    provide: APP_FILTER,
    useClass: CustomExceptionFilter,
  }, {
    provide: APP_FILTER,
    useClass: CustomNotFoundException,
  }],
  controllers: [DeviceController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    HelmetMiddleware.configure({
      contentSecurityPolicy: ({
        directives: {
          'script-src': [
            "'self",
            (req, res) => getOrCreateNonce(res),
          ],
          'default-src': ["'self"],
          'style-scr': ["'self"],
          'img-scr': ["'self"],
        }
      })
    });
    consumer.apply(HelmetMiddleware).forRoutes('*');
  }

}

