import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter, CustomNotFoundException } from './handler/error.handler';
import { HelmetMiddleware } from '@nest-middlewares/helmet';
// import { ServerResponse, IncomingMessage } from 'http';
import { getOrCreateNonce } from './utils/task.util';
import { EventEmitterModule } from '@nestjs/event-emitter';

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
    TaskModule,
    EventEmitterModule.forRoot({
    }),
  ],
  providers: [{
    provide: APP_FILTER,
    useClass: CustomExceptionFilter,
  }, {
    provide: APP_FILTER,
    useClass: CustomNotFoundException,
  },],
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
// function getOrCreateNonce(res: ServerResponse<IncomingMessage>): string {
//   throw new Error('Function not implemented.');
// }

