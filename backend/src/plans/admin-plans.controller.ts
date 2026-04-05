import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { Plan } from 'src/generated/prisma/client';
import { Role } from 'src/generated/prisma/enums';

import { PlanCreateDto } from './dto/plan-create.dto';
import { PlanUpdateDto } from './dto/plan-update.dto';
import { PlansService } from './plans.service';

@ApiTags('admin-plans')
@Controller('admin/plans')
@Auth(Role.ADMIN)
export class AdminPlansController {
  constructor(private readonly plansService: PlansService) {}

  @ApiOperation({ summary: 'List all plans' })
  @ApiResponse({ status: 200, description: 'Plans' })
  @Get()
  findAll(): Promise<Plan[]> {
    return this.plansService.findAll();
  }

  @ApiOperation({ summary: 'Get plan by id' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Plan' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Plan> {
    return this.plansService.findOne(id);
  }

  @ApiOperation({ summary: 'Create plan' })
  @ApiBody({ type: PlanCreateDto })
  @ApiResponse({ status: 201, description: 'Created' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @Post()
  create(@Body() dto: PlanCreateDto): Promise<Plan> {
    return this.plansService.create(dto);
  }

  @ApiOperation({ summary: 'Update plan' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: PlanUpdateDto })
  @ApiResponse({ status: 200, description: 'Updated' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 409, description: 'Conflict' })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: PlanUpdateDto,
  ): Promise<Plan> {
    return this.plansService.update(id, dto);
  }

  @ApiOperation({ summary: 'Delete plan' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Deleted' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @ApiResponse({ status: 409, description: 'Referenced by other records' })
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<{ ok: true }> {
    await this.plansService.remove(id);
    return { ok: true };
  }
}
