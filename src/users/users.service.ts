import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  async findOne(id: number) {
    if(!id){
      return null;
    }
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
  async find() {
    return await this.userRepository.find();
  }

  async findAllByEmail(email) {
    return await this.userRepository.find({ email });
  }
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return this.userRepository.save({ ...user, ...attrs });
  }
  async remove(id: number) {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new HttpException('Not found', HttpStatus.NOT_FOUND);
    }
    return await this.userRepository.remove(user);
  }
}
