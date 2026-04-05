import { ApiProperty } from '@nestjs/swagger';
import { PlanKey } from 'src/generated/prisma/enums';

export class PublicPlanDto {
  @ApiProperty()
  id: number;

  @ApiProperty({ enum: PlanKey, enumName: 'PlanKey' })
  key: PlanKey;

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
}
