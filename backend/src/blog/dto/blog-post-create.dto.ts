import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { BlogPostStatus } from 'src/generated/prisma/client';

export class BlogPostCreateDto {
  @ApiProperty({ description: 'Post title', example: 'Hello world' })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'URL slug (lowercase letters, numbers, hyphens)',
    example: 'hello-world',
  })
  @IsString()
  @MinLength(1)
  @MaxLength(200)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      'slug must be lowercase alphanumeric segments separated by single hyphens',
  })
  @IsNotEmpty()
  slug: string;

  @ApiProperty({ description: 'Body (HTML or markdown)', required: false })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: 'Short excerpt for listings', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(2000)
  excerpt?: string;

  @ApiProperty({
    enum: BlogPostStatus,
    description: 'Publication state',
    required: false,
    default: BlogPostStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(BlogPostStatus)
  status?: BlogPostStatus;
}
