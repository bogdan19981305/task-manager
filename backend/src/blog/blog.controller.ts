import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserEntity } from 'src/auth/entities/user.entity';
import { Role } from 'src/generated/prisma/enums';

import { BlogService } from './blog.service';
import { BlogPostCreateDto } from './dto/blog-post-create.dto';
import { BlogPostQueryDto } from './dto/blog-post-query.dto';

@ApiTags('blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @ApiOperation({ summary: 'Public blog overview' })
  @ApiResponse({
    status: 200,
    description: 'Metadata and published post count',
  })
  @Get()
  getOverview() {
    return this.blogService.getOverview();
  }

  @ApiOperation({ summary: 'Create a blog post (admin)' })
  @ApiBody({ type: BlogPostCreateDto })
  @ApiResponse({ status: 201, description: 'Post created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 409, description: 'Slug already in use' })
  @Auth(Role.ADMIN)
  @Post('posts')
  createPost(@CurrentUser() user: UserEntity, @Body() dto: BlogPostCreateDto) {
    return this.blogService.createBlogPost(user.id, dto);
  }

  @ApiOperation({ summary: 'Paginated list of published posts' })
  @ApiResponse({ status: 200, description: 'Page of posts' })
  @Get('posts')
  getPosts(@Query() query: BlogPostQueryDto) {
    return this.blogService.getPublishedPosts(query);
  }

  @ApiOperation({ summary: 'Published post by slug' })
  @ApiParam({ name: 'slug', description: 'Post URL slug' })
  @ApiResponse({ status: 200, description: 'Post' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @Get('posts/:slug')
  getPostBySlug(@Param('slug') slug: string) {
    return this.blogService.getPublishedPostBySlug(slug);
  }
}
