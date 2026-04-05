import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { PublicPlanDto } from './dto/public-plan.dto';
import { PlansService } from './plans.service';

@ApiTags('plans')
@Controller('plans')
export class PublicPlansController {
  constructor(private readonly plansService: PlansService) {}

  @ApiOperation({ summary: 'List active plans (public)' })
  @ApiResponse({ status: 200, type: [PublicPlanDto] })
  @Get()
  findActive(): Promise<PublicPlanDto[]> {
    return this.plansService.findActivePublic();
  }
}
