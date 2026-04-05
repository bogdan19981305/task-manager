import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { PlanKey } from 'src/generated/prisma/enums';

export class PlanCreateDto {
  @ApiProperty({ enum: PlanKey, enumName: 'PlanKey' })
  @IsEnum(PlanKey)
  key: PlanKey;

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
