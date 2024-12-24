import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    const now = Date.now();
    const expiration = new Date('2024-12-23T14:33:00-03:00');
    // const EXPIRATION_BUFFER_MS = 3600 * 1000; // 1 hour in milliseconds

    console.log({
      'now.getTime()': now, // 1711187400000
      'expiration.getTime()': expiration.getTime(), // 1711194600000
      'difference in ms': expiration.getTime() - now, // 7200000
      'is valid': expiration.getTime() - now > 0, // true
    });
    //return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
