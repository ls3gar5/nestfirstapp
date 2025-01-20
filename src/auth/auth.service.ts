import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ApiProperty } from '@nestjs/swagger';

export class AuthInput {
  @ApiProperty({
    description: 'User name',
    example: 'Alice',
    required: true,
  })
  username: string;
  @ApiProperty({
    description: 'User password',
    example: 'changeme!',
    required: true,
    minLength: 6,
  })
  password: string;
}
type SigninData = { userId: number; username: string };
type AuthResult = { accessToken: string; userId: number; userName: string };
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

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

  async login() {
    throw new Error('Method not implemented.');
  }

  async authenticateUser(authInput: AuthInput): Promise<AuthResult | null> {
    const user = await this.validateUser(authInput);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return await this.signIn(user);
  }

  async validateUser(authInput: AuthInput): Promise<SigninData | null> {
    const user = await this.usersService.findUserByName(authInput.username);
    if (user && user.password === authInput.password) {
      return { userId: user.userId, username: user.userName };
    }
    return null;
  }

  async signIn(user: SigninData): Promise<AuthResult> {
    const payload = { username: user.username, sub: user.userId };
    return {
      accessToken: this.jwtService.sign(payload),
      userId: user.userId,
      userName: user.username,
    };
  }
}
