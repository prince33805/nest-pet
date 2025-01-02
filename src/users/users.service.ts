import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) { }

  async create(user: { username: string; email: string; password: string }) {
    try {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = {
        ...user,
        password: hashedPassword,
      };
      return await this.usersRepository.save(newUser)
    } catch (error) {
      console.error('Error create user:', error);
      throw new Error('Failed to create user. Please try again later.');
    }
  }

  async findById(id: string): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ username });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOneBy({ email });
  }

  async saveRefreshToken(userId: string, refreshToken: string) {
    console.log("saveRefreshToken")
    const hashedToken = await bcrypt.hash(refreshToken, 10);
    await this.usersRepository.update(userId, { refreshToken: hashedToken });
  }

}
