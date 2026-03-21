import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcryptjs from 'bcryptjs';
import { RedisService } from 'src/common/redis/redis.service';
import { Role, User } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto.dto';
import { RegisterDto } from './dto/register-dto.dto';

const mockCreateUser: Pick<User, 'email' | 'name' | 'id'> = {
  email: 'test@example.com',
  name: 'Test User',
  id: 1,
};

const mockLoginDto: LoginDto = {
  email: 'test@example.com',
  password: 'password',
};

const mockRegisterUser: Omit<
  Pick<User, 'email' | 'name'>,
  'refreshToken' | 'accessToken'
> & { refreshToken: string; accessToken: string } = {
  email: 'test@example.com',
  name: 'Test User',
  refreshToken: '1234567890',
  accessToken: '1234567890',
};

const mockUserRegisterDto: RegisterDto = {
  email: 'test@example.com',
  name: 'Test User',
  password: 'password',
  passwordConfirmation: 'password',
};

const mockPrismaService = {
  user: {
    findUnique: jest.fn().mockResolvedValue(mockCreateUser),
    create: jest.fn().mockResolvedValue(mockCreateUser),
  },
};

const mockRedisService = {
  get: jest.fn(),
  set: jest.fn(),
  deleteKeysByPattern: jest.fn(),
  del: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('1234567890'),
};

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let redisService: RedisService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    redisService = module.get<RedisService>(RedisService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('register', () => {
    it('should register a user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      const user = await authService.register(mockUserRegisterDto);
      expect(user).toEqual(mockRegisterUser);
    });

    it('should throw an error if the user already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockRegisterUser);
      await expect(authService.register(mockUserRegisterDto)).rejects.toThrow(
        new UnauthorizedException('Email already in use'),
      );
    });

    it('should throw an error if the passwords do not match', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      await expect(
        authService.register({
          ...mockUserRegisterDto,
          passwordConfirmation: 'different-password',
        }),
      ).rejects.toThrow(new BadRequestException('Passwords do not match'));
    });
  });

  describe('login', () => {
    it('should throw an error if the user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      await expect(authService.login(mockLoginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials or user not found'),
      );
    });

    it('should throw an error if the user does not have a password hash', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(mockCreateUser);
      await expect(authService.login(mockLoginDto)).rejects.toThrow(
        new UnauthorizedException('Please login with Google or GitHub'),
      );
    });

    it('should throw an error if the password is incorrect', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({
        ...mockCreateUser,
        passwordHash: 'different-password',
      });
      await expect(authService.login(mockLoginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials'),
      );
    });

    it('should return the user, access token, and refresh token', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce({
        ...mockUserRegisterDto,
        passwordHash: await bcryptjs.hash('password', 10),
        role: Role.USER,
        id: 1,
        email: 'test@example.com',
        name: mockUserRegisterDto.name,
      });
      const result = await authService.login(mockLoginDto);
      expect(result).toEqual({
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User',
          role: Role.USER,
        },
        accessToken: '1234567890',
        refreshToken: '1234567890',
      });
    });
  });

  describe('logout', () => {
    it('should delete refresh token from redis', async () => {
      await authService.logout(1);

      expect(mockRedisService.del).toHaveBeenCalledWith('refresh_token:1');
    });
  });

  describe('refresh', () => {
    it('should throw an error if the user does not exist', async () => {
      mockPrismaService.user.findUnique.mockResolvedValueOnce(null);
      await expect(authService.refresh(1, '1234567890')).rejects.toThrow(
        new UnauthorizedException('User not found'),
      );
    });

    it('should throw an error if the refresh token is not found', async () => {
      mockRedisService.get.mockResolvedValueOnce(null);
      await expect(authService.refresh(1, '1234567890')).rejects.toThrow(
        new UnauthorizedException('No refresh token found'),
      );
    });

    it('should throw an error if the refresh token is invalid', async () => {
      mockRedisService.get.mockResolvedValueOnce('invalid-token');
      await expect(authService.refresh(1, '1234567890')).rejects.toThrow(
        new UnauthorizedException('Invalid refresh token'),
      );
    });

    it('should return the new access token and refresh token', async () => {
      mockRedisService.get.mockResolvedValueOnce(
        await bcryptjs.hash('1234567890', 10),
      );
      const result = await authService.refresh(1, '1234567890');
      expect(result).toEqual({
        accessToken: '1234567890',
        refreshToken: '1234567890',
      });
    });
  });
});
