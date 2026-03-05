import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { UserEntity } from '../entities/user.entity';

type JwtPayload = {
  userId: number;
  email: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private readonly prismaService: PrismaService,
  ) {
    const secretOrKey = configService.getOrThrow<string>('JWT_SECRET');
    const jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    super({ jwtFromRequest, secretOrKey });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prismaService.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }
    return new UserEntity({
      ...user,
      id: user.id,
      email: user.email,
      name: user.name ?? undefined,
    });
  }
}
