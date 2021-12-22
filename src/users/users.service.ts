import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}
  async create(user: CreateUserDto) {
    const { email, password } = user;
    const newUser = await this.userRepository.create({ email, password });
    return await this.userRepository.save(newUser);
  }
}
