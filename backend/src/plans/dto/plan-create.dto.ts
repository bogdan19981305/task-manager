import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { BillingInterval, PlanKey } from 'src/generated/prisma/enums';

export class PlanCreateDto {
  @ApiProperty({ enum: PlanKey, enumName: 'PlanKey' })
  @IsEnum(PlanKey)
  key: PlanKey;

  @ApiPropertyOptional({
    enum: BillingInterval,
    enumName: 'BillingInterval',
    default: BillingInterval.MONTH,
    description: 'Defaults to MONTH when omitted',
  })
  @IsOptional()
  @IsEnum(BillingInterval)
  interval?: BillingInterval;

  @ApiPropertyOptional({
    nullable: true,
    description: 'Free trial length in days (omit or null for no trial)',
  })
  @IsOptional()
  @ValidateIf((_, v: unknown) => v !== null && v !== undefined)
  @IsInt()
  @Min(0)
  @Max(3660)
  trialDays?: number | null;

  @ApiProperty({ example: 'Pro' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 2900,
    description: 'Amount in minor units (e.g. cents)',
  })
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'usd' })
  @IsString()
  @IsOptional()
  @MaxLength(8)
  currency?: string;

  @ApiProperty({ type: [String], example: ['Feature A'] })
  @IsArray()
  @IsString({ each: true })
  features: string[];

  @ApiProperty({ type: [String], example: ['tasks:read'] })
  @IsArray()
  @IsString({ each: true })
  permissions: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  stripePriceId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  stripeProductId?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ default: 0 })
  @IsInt()
  @IsOptional()
  sortOrder?: number;
}
