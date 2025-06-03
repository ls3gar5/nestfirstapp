import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      isGlobal: true, // Makes CacheModule available everywhere
      ttl: 60, // seconds    
      max: 1000, // maximum number of items in cache
      store: 'memory', // default store
      // You can also use other stores like 'redis' or 'ioredis' if configured
    }),
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available everywhere
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGOURL),
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
