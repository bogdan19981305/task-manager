import 'express';

import { Role } from 'src/generated/prisma/enums';

declare module 'express' {
  interface Request {
    user?: {
      sub: string;
      email: string;
      role: Role;
    };
  }
}
