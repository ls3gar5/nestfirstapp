import { Injectable } from '@nestjs/common';

@Injectable()
export class TaskRepository {
  getMessage(): string {
    return 'example';
  }
}
