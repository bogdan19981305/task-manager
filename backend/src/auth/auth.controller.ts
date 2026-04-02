import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { AuthService } from './auth.service';
import {
  ACCESS_TTL_MS,
  AUTH_COOKIES,
  buildCookieOptions,
  REFRESH_TTL_MS,
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

  @ApiOperation({ summary: 'Login with GitHub' })
  @ApiResponse({ status: 302, description: 'Redirect to frontend' })
  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuth() {}

  @ApiOperation({ summary: 'GitHub callback' })
  @ApiResponse({ status: 302, description: 'Redirect to frontend' })
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as unknown as UserEntity;
    const { accessToken, refreshToken } =
      await this.authService.loginWithThirdParty(user);
    this.setAuthCookies(res, accessToken, refreshToken);
    return res.redirect(
      this.configService.getOrThrow('FRONTEND_URL') + '/tasks',
    );
  }

  @ApiOperation({ summary: 'Login with Google' })
  @ApiResponse({ status: 302, description: 'Redirect to frontend' })
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuth() {}

  @ApiOperation({ summary: 'Google callback' })
  @ApiResponse({ status: 302, description: 'Redirect to frontend' })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = req.user as unknown as UserEntity;
    const { accessToken, refreshToken } =
      await this.authService.loginWithThirdParty(user);
    this.setAuthCookies(res, accessToken, refreshToken);
    return res.redirect(
      this.configService.getOrThrow('FRONTEND_URL') + '/tasks',
    );
  }

  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email, name, refreshToken, accessToken } =
      await this.authService.register(registerDto);
    this.setAuthCookies(res, accessToken, refreshToken);
    return { user: { email, name } };
  }

  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, accessToken, refreshToken } =
      await this.authService.login(loginDto);
    this.setAuthCookies(res, accessToken, refreshToken);
    return { user: { email: user.email, name: user.name } };
  }

  @ApiOperation({ summary: 'Refresh a token' })
  @ApiResponse({ status: 200, description: 'Token refreshed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('refresh')
  @HttpCode(200)
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

  @ApiOperation({ summary: 'Logout a user' })
  @ApiResponse({ status: 200, description: 'User logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Post('logout')
  @HttpCode(200)
  @Auth()
  async logout(
    @CurrentUser() user: UserEntity,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.authService.logout(user.id);

    res.clearCookie(AUTH_COOKIES.access, buildCookieOptions(0, '/'));
    res.clearCookie(AUTH_COOKIES.refresh, buildCookieOptions(0, '/'));

    return { ok: true };
  }

  @ApiOperation({ summary: 'Get the current user' })
  @ApiResponse({ status: 200, description: 'User fetched successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get('me')
  @Auth()
  me(@CurrentUser() user: UserEntity) {
    return user;
  }
}
