import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import {
  ACCESS_TTL_MS,
  AUTH_COOKIES,
  REFRESH_TTL_MS,
  buildCookieOptions,
} from './constants/auth.constants';
import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login-dto.dto';
import { RegisterDto } from './dto/register-dto.dto';
import { UserEntity } from './entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  private setAuthCookies(res: Response, access: string, refresh: string) {
    res.cookie(AUTH_COOKIES.access, access, buildCookieOptions(ACCESS_TTL_MS));
    res.cookie(
      AUTH_COOKIES.refresh,
      refresh,
      buildCookieOptions(REFRESH_TTL_MS),
    );
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(loginDto);
    this.setAuthCookies(res, accessToken, refreshToken);
    return { user: { email: user.email, name: user.name } };
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.[AUTH_COOKIES.refresh];
    if (!refreshToken) throw new UnauthorizedException('No refresh token');
    const secret = this.configService.getOrThrow<string>('JWT_SECRET');

    // verify signature + expiry
    const payload = this.jwtService.verify(refreshToken, {
      secret,
    });

    const { accessToken, refreshToken: newRefresh } =
      await this.authService.refresh(payload.userId, refreshToken);

    this.setAuthCookies(res, accessToken, newRefresh);

    return { ok: true };
  }

  @Post('logout')
  @Auth()
  async logout(
    @CurrentUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.id);

    res.clearCookie(AUTH_COOKIES.access, { path: '/' });
    res.clearCookie(AUTH_COOKIES.refresh, { path: '/' });

    return { ok: true };
  }

  @Get('me')
  @Auth()
  me(@CurrentUser() user: UserEntity) {
    return user;
  }
}
