import { Injectable } from '@nestjs/common';

export type User = {
  userId: number;
  userName: string;
  password: string;
};

// FIXME: This is a mock data, replace it with real data
const users: User[] = [
  {
    userId: 1,
    userName: 'Alice',
    password: 'changeme!',
  },
  {
    userId: 2,
    userName: 'chris',
    password: 'changeme!',
  },
];

@Injectable()
export class UsersService {
  async findUserByName(userName: string): Promise<User | undefined> {
    return users.find((user) => user.userName === userName);
  }
}
