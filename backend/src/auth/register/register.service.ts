import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import * as bcryptjs from 'bcryptjs';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register-dto.module';

@Injectable()
export class RegisterService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    Logger.log(registerDto);
    const foundUser = await this.prisma.user.findUnique({
      where: {
        email: registerDto.email.toLowerCase(),
      },
    });
    if (foundUser) {
      throw new BadRequestException('Email already in use');
    }
    const hashedPassword = await bcryptjs.hash(registerDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email.toLowerCase(),
        name: registerDto.name,
        passwordHash: hashedPassword,
      },
      select: {
        email: true,
        name: true,
      },
    });
    return user;
  }
}
