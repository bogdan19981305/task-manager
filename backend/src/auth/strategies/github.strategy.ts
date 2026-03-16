import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email', 'read:user'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ) {
    const email = profile?.emails?.[0]?.value as string;
    const name = profile?.displayName;
    const githubId = profile?.id;

    let user = await this.prisma.user.findUnique({
      where: { githubId },
    });

    if (!user) {
      user = await this.prisma.user.findUnique({
        where: { email },
      });
    }

    if (user && !user.githubId) {
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: { githubId },
      });
    }

    if (!user) {
      user = await this.prisma.user.create({
        data: { email, name, githubId },
      });
    }

    return user;
  }
}
