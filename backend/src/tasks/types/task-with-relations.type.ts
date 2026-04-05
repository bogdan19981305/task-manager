import type { Prisma } from 'src/generated/prisma/client';

import { TASK_INCLUDE_CONSTANT } from '../constants/task-include-constant';

export type TaskWithRelations = Prisma.TaskGetPayload<{
  include: typeof TASK_INCLUDE_CONSTANT;
}>;
