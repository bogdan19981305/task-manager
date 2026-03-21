import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { UsersService } from './users.service';

const mockUser: Pick<User, 'id' | 'email' | 'name'> = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
};

const mockUsers: Pick<User, 'id' | 'email' | 'name'>[] = [
  mockUser,
  mockUser,
  mockUser,
];
const mockPrismaService = {
  user: {
    findMany: jest.fn().mockResolvedValue(mockUsers),
  },
};

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const users = await usersService.getUsers();
      expect(users).toEqual(mockUsers);
    });
  });
});
