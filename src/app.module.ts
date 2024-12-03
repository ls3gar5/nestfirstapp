import { Module } from '@nestjs/common';
import { TaskModule } from './task/task.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available everywhere
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      'mongodb://root:admin@localhost:27017/?authMechanism=DEFAULT&authSource=admin',
    ),
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
