import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import { USER_SELECT_CONSTANT } from './constants/user-select.constant';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  async getUsers() {
    return this.prisma.user.findMany({
      select: USER_SELECT_CONSTANT,
    });
  }
}
