import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import type { Server } from 'socket.io';
import { AUTH_COOKIES } from 'src/auth/constants/auth.constants';
import type { JwtSignPayload } from 'src/auth/types/jwt.type';

import { TasksRealtimeService } from './tasks-realtime.service';

function accessTokenFromCookieHeader(
  cookieHeader: string | undefined,
): string | undefined {
  if (!cookieHeader) return undefined;
  for (const segment of cookieHeader.split(';')) {
    const idx = segment.indexOf('=');
    if (idx === -1) continue;
    const name = segment.slice(0, idx).trim();
    if (name === AUTH_COOKIES.access) {
      return decodeURIComponent(segment.slice(idx + 1).trim());
    }
  }
  return undefined;
}

@WebSocketGateway({
  namespace: '/tasks',
  cors: {
    origin: true,
    credentials: true,
  },
})
export class TasksGateway implements OnGatewayInit {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(TasksGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly tasksRealtime: TasksRealtimeService,
  ) {}

  afterInit() {
    this.tasksRealtime.attachServer(this.server);
    this.server.use((socket, next) => {
      const authToken = socket.handshake.auth?.token;
      if (typeof authToken === 'string' && authToken.length > 0) {
        try {
          const payload = this.jwtService.verify<
            JwtSignPayload & { typ?: string }
          >(authToken);
          if (payload.typ === 'socket') {
            return next();
          }
        } catch {
          // fall through to cookie
        }
      }

      const cookieToken = accessTokenFromCookieHeader(
        socket.handshake.headers.cookie,
      );
      if (!cookieToken) {
        return next(new Error('Unauthorized'));
      }
      try {
        this.jwtService.verify(cookieToken);
        return next();
      } catch {
        this.logger.warn('WebSocket JWT verify failed');
        return next(new Error('Unauthorized'));
      }
    });
  }
}
