import { TaskQueryDto } from '../dto/task-query.dto';

export const TASK_CACHE_PREFIX = 'task';

export const GET_TASKS_CACHE_KEY = (taskQueryDto: TaskQueryDto) =>
  `${TASK_CACHE_PREFIX}:${taskQueryDto.status}:${JSON.stringify(taskQueryDto)}`;
