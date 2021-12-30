import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findAllByEmail: (email) => {
        return Promise.resolve([
          { id: 1, email, password: 'password' } as User,
        ]);
      },
      findOne: (id) => {
        return Promise.resolve({
          id,
          email: 'df@ukr.net',
          password: 'password',
        } as User);
      },
      // remove: (id)=>{},
      // update: (id)=>{},
    };
    fakeAuthService = {
      signup: (email, password) => {
        return Promise.resolve({ id: 1, email: 'fr@gmail.com' } as User);
      },
      signin: (email, password) => {
        return Promise.resolve({ id: 1, email } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('findAllByEmail should return array of users with given emails', async () => {
    const users = await controller.findAllByEmail('hello@gmail.com');
    expect(users[0].email).toEqual('hello@gmail.com');
  });
  it('findOne should return user with given id', async () => {
    const user = await controller.findUser('1');
    expect(user.id).toEqual(1);
  });
  it('findOne should throw an error if user not found by id', async () => {
    fakeUsersService.findOne = () => null;
    try {
      await controller.findUser('1');
    } catch (err) {
      // done();
    }
  });
  it('signin should return user and session id', async () => {
    const session = { userId: -200 };
    const user = await controller.signin(
      { email: 'em@gmail.com', password: 'password' },
      session,
    );
    expect(session.userId).toEqual(1);
    expect(user.email).toEqual('em@gmail.com');
  });
});
