import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get the hello message' })
  @ApiResponse({
    status: 200,
    description: 'Hello message fetched successfully',
    example: 'Hello World',
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
