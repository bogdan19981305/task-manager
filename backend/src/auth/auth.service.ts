import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from 'bcryptjs';
import ms from 'ms';
import { RedisService } from 'src/common/redis/redis.service';
import { NotificationService } from 'src/notification/notification.service';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  ACCESS_TTL_MS,
  REDIS_REFRESH_KEY,
  REFRESH_TTL_SECONDS,
  SOCKET_HANDSHAKE_TTL_MS,
} from './constants/auth.constants';
import { LoginDto } from './dto/login-dto.dto';
import { RegisterDto } from './dto/register-dto.dto';
import { UserEntity } from './entities/user.entity';
import { JwtSignPayload, SocketHandshakeJwtPayload } from './types/jwt.type';
import { SessionUserType } from './types/session-user.type';
import { ThirdPartyAuthUser } from './types/third-party-auth-user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly notificationService: NotificationService,
  ) {}

  async register(registerDto: RegisterDto) {
    const foundUser = await this.prisma.user.findUnique({
      where: { email: registerDto.email.toLowerCase() },
    });

    if (foundUser) {
      throw new BadRequestException('Email already in use');
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
      select: { id: true, email: true, name: true, role: true },
    });

    const session = await this.issueAuthSession(user);

    await this.enqueueWelcomeEmailForNewUser(user);

    return {
      email: user.email,
      name: user.name,
      refreshToken: session.refreshToken,
      accessToken: session.accessToken,
    };
  }

  private async enqueueWelcomeEmailForNewUser(user: {
    id: number;
    email: string | null;
    name: string | null;
  }) {
    await this.notificationService.enqueueWelcomeEmail({
      userId: user.id,
      email: user.email ?? '',
      name: user.name ?? '',
    });
  }

  private async issueAuthSession(user: SessionUserType) {
    const payload: JwtSignPayload = {
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

  private signAccessToken(payload: JwtSignPayload) {
    return this.jwtService.sign(payload, { expiresIn: ms(ACCESS_TTL_MS) });
  }

  /** Socket.IO-only JWT (`typ: 'socket'`); issued after cookie session is verified via HTTP. */
  signSocketHandshakeToken(user: UserEntity): string {
    const payload: SocketHandshakeJwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      typ: 'socket',
    };
    return this.jwtService.sign(payload, {
      expiresIn: ms(SOCKET_HANDSHAKE_TTL_MS),
    });
  }

  private signRefreshToken(payload: JwtSignPayload) {
    return this.jwtService.sign(payload, { expiresIn: REFRESH_TTL_SECONDS });
  }

  private async setRefreshTokenHash(userId: number, refreshToken: string) {
    const hash = await bcryptjs.hash(refreshToken, 10);
    await this.redisService.set(
      REDIS_REFRESH_KEY(userId),
      hash,
      REFRESH_TTL_SECONDS,
    );
  }

  async loginWithThirdParty(user: ThirdPartyAuthUser) {
    const session = await this.issueAuthSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    if (user.isNewUser) {
      await this.enqueueWelcomeEmailForNewUser(user);
    }

    return session;
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

    return this.issueAuthSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  }

  async logout(userId: number) {
    await this.redisService.del(REDIS_REFRESH_KEY(userId));
  }

  async refresh(userId: number, refreshToken: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, role: true },
    });

    if (!user) throw new UnauthorizedException('User not found');

    const cachedRefreshToken = await this.redisService.get<string>(
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

    const session = await this.issueAuthSession({
      id: user.id,
      email: user.email,
      name: null,
      role: user.role,
    });

    return {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    };
  }
}
