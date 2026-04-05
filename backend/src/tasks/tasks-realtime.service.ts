import { Injectable } from '@nestjs/common';
import type { Server } from 'socket.io';

import { TASKS_WS_EVENTS } from './constants/tasks-ws.constant';
import type { TaskWithRelations } from './types/task-with-relations.type';

@Injectable()
export class TasksRealtimeService {
  private server: Server | null = null;

  attachServer(server: Server) {
    this.server = server;
  }

  emitTaskCreated(task: TaskWithRelations) {
    this.server?.emit(TASKS_WS_EVENTS.created, task);
  }

  emitTaskUpdated(task: TaskWithRelations) {
    this.server?.emit(TASKS_WS_EVENTS.updated, task);
  }

  emitTaskDeleted(task: TaskWithRelations) {
    this.server?.emit(TASKS_WS_EVENTS.deleted, task);
  }
}
