import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class TaskGenerateDescriptionDto {
  @ApiProperty({ example: 'Ship Q2 billing export' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  title!: string;
}
