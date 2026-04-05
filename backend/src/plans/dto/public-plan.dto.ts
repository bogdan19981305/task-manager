import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BillingInterval, PlanKey } from 'src/generated/prisma/enums';

export class PublicPlanDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: PlanKey, enumName: 'PlanKey' })
  key: PlanKey;

  @ApiProperty({ enum: BillingInterval, enumName: 'BillingInterval' })
  interval: BillingInterval;

  @ApiProperty()
  name: string;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty({ description: 'Amount in minor units (e.g. cents)' })
  price: number;

  @ApiProperty({ example: 'usd' })
  currency: string;

  @ApiProperty({ type: [String] })
  features: string[];

  @ApiProperty()
  sortOrder: number;

  @ApiPropertyOptional({ nullable: true, description: 'Trial period in days' })
  trialDays: number | null;
}
