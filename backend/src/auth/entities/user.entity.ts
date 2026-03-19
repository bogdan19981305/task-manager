import { Exclude, Expose } from 'class-transformer';
import { Role } from 'src/generated/prisma/enums';

export class UserEntity {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Exclude()
  passwordHash?: string;

  @Expose()
  role: Role;

  @Exclude()
  refreshTokenHash?: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
