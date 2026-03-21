import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import ms from 'ms';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  ACCESS_TTL_MS,
  REDIS_REFRESH_KEY,
  REFRESH_TTL_MS,
} from './constants/auth.constants';
import { LoginDto } from './dto/login-dto.dto';
import { RegisterDto } from './dto/register-dto.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async register(registerDto: RegisterDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email.toLowerCase() },
    });

    if (foundUser) {
      throw new UnauthorizedException('Email already in use');
    }

    if (registerDto.password !== registerDto.passwordConfirmation) {
      throw new BadRequestException('Passwords do not match');
    }

    const hashedPassword = await bcryptjs.hash(registerDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email.toLowerCase(),
        name: registerDto.name,
        passwordHash: hashedPassword,
      },
      select: { id: true, email: true, name: true },
    });

    const signPayload = { userId: user.id, email: user.email || '' };
    const accessToken = this.signAccessToken(signPayload);
    const refreshToken = this.signRefreshToken(signPayload);

    await this.setRefreshTokenHash(user.id, refreshToken);

    return { email: user.email, name: user.name, refreshToken, accessToken };
  }

  private signAccessToken(payload: { userId: number; email: string }) {
    return this.jwtService.sign(payload, { expiresIn: ms(ACCESS_TTL_MS) });
  }

  private signRefreshToken(payload: { userId: number; email: string }) {
    return this.jwtService.sign(payload, { expiresIn: ms(REFRESH_TTL_MS) });
  }

  private async setRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await bcryptjs.hash(refreshToken, 10);
    await this.cacheManager.set(
      REDIS_REFRESH_KEY(userId),
      hash,
      REFRESH_TTL_MS,
    );
  }

  async loginWithThirdParty(user: UserEntity) {
    const payload = { userId: user.id, email: user.email, role: user.role };

    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);

    await this.setRefreshTokenHash(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email.toLowerCase() },
    });

    if (!user)
      throw new UnauthorizedException('Invalid credentials or user not found');

    if (!user.passwordHash) {
      throw new UnauthorizedException('Please login with Google or GitHub');
    }

    const isPasswordValid = await bcryptjs.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const payload = {
      userId: user.id,
      email: user.email || '',
      role: user.role,
    };

    const accessToken = this.signAccessToken(payload);
    const refreshToken = this.signRefreshToken(payload);

    await this.setRefreshTokenHash(user.id, refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  async logout(userId: number) {
    await this.cacheManager.del(REDIS_REFRESH_KEY(userId));
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const cachedRefreshToken = await this.cacheManager.get<string>(
      REDIS_REFRESH_KEY(userId),
    );
    if (!cachedRefreshToken)
      throw new UnauthorizedException('No refresh token found');

    const isRefreshTokenValid = await bcryptjs.compare(
      refreshToken,
      cachedRefreshToken,
    );
    if (!isRefreshTokenValid)
      throw new UnauthorizedException('Invalid refresh token');

    const payload = {
      userId: user.id,
      email: user.email || '',
      role: user.role,
    };

    const newAccessToken = this.signAccessToken(payload);
    const newRefreshToken = this.signRefreshToken(payload);

    await this.setRefreshTokenHash(user.id, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
