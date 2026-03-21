import { TaskQueryDto } from '../dto/task-query.dto';

export const TASK_CACHE_PREFIX = 'task';
export const ALL_TASK_CACHE_KEY = `${TASK_CACHE_PREFIX}:*`;

export const TASK_TTL = 60; // 1 minute

export const GET_TASKS_CACHE_KEY = (taskQueryDto: TaskQueryDto) =>
  `${TASK_CACHE_PREFIX}:${JSON.stringify(taskQueryDto)}`;
