import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Session,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Get('/colors/:color')
  async setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }
  @Get('/colors')
  async getColor(@Session() session: any) {
    return session.color;
  }
  // @Get('/whoami')
  // async whoami(@Session() session: any) {
  //   return await this.usersService.findOne(session.userId);
  // }
  @Get('/whoami')
  @UseGuards(AuthGuard)
  async whoami(@CurrentUser() user: User) {
    return user;
  }
  @Post('/signout')
  async signOut(@Session() session: any) {
    session.userId = null;
  }
  @Post('/signup')
  async createUser(@Body() user: CreateUserDto, @Session() session: any) {
    const userEntity = await this.authService.signup(user.email, user.password);
    session.userId = userEntity.id;
    return userEntity;
  }

  @Post('/signin')
  async signin(@Body() user: CreateUserDto, @Session() session: any) {
    const userEntity = await this.authService.signin(user.email, user.password);
    session.userId = userEntity.id;
    return userEntity;
  }

  @Get('/all')
  async findAllUsers() {
    return await this.usersService.find();
  }
  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    console.log('handler is running');
    return await this.usersService.findOne(parseInt(id));
  }
  @Get()
  async findAllByEmail(@Query('email') email: string) {
    return await this.usersService.findAllByEmail(email);
  }
  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    return await this.usersService.remove(parseInt(id));
  }
  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return await this.usersService.update(parseInt(id), body);
  }
}
