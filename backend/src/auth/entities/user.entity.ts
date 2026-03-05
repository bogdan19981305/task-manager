import { Exclude, Expose } from 'class-transformer';

export class UserEntity {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  name: string;

  @Exclude()
  passwordHash?: string;

  @Exclude()
  refreshTokenHash?: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
