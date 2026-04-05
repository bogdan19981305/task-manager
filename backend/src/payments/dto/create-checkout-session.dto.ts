import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class CreateCheckoutSessionDto {
  @ApiProperty({
    description: 'The id of the plan to create a checkout session for',
    example: 1,
    required: true,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  planId: number;
}
