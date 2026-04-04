import { Role } from 'src/generated/prisma/enums';

export type SessionUserType = {
  id: number;
  email: string | null;
  name: string | null;
  role: Role;
};
