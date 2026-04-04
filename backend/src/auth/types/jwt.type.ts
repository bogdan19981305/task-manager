import { Role } from 'src/generated/prisma/enums';

export type JwtSignPayload = { userId: number; email: string; role: Role };
