import { UserEntity } from '../entities/user.entity';

export type ThirdPartyAuthUser = UserEntity & { isNewUser: boolean };
