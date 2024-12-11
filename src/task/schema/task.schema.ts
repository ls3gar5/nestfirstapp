import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import { TaskStatus } from '../entities/task.entity';

export type TaskDocument = HydratedDocument<Tasks>;

@Schema()
export class Tasks {
  id: string;
  @Prop({ type: MongooseSchema.Types.String, alias: 'id' })
  _id: string;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  status: TaskStatus;
}

export const TaskSchema = SchemaFactory.createForClass(Tasks);
