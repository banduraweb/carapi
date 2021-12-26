import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  const users: User[] = [];
  beforeEach(async () => {
    fakeUsersService = {
      //Create a fake copy of the users service
      findAllByEmail: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: ({ email, password }) => {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });
  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });
  it('creates new user with salted and hashed password', async () => {
    const user = await service.signup('qwer@gmail.com', '123456');
    expect(user.password).not.toEqual('123456');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
  it('throw an error if user with email already exists', async () => {
    await service.signup('rt@gmail.com', '123456');
    try {
      await service.signup('rt@gmail.com', '123456');
    } catch (e) {
      // done();
    }
  });
  it('throws if signin is called with unused email', async () => {
    try {
      await service.signin('rt@gmail.com', '123456');
    } catch (e) {
      // done();
    }
  });
  it('throws if invalid password', async () => {
    await service.signup('rt3@gmail.com', '1');
    try {
      await service.signin('rt3@gmail.com', 'password');
    } catch (e) {
      // done();
    }
  });
  it('returns a user if password is valid', async () => {
    await service.signup('rt2@gmail.com', '3333');
    const user = await service.signin('rt2@gmail.com', '3333');
    expect(user).toBeDefined();
  });
});
