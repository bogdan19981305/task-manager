import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RedisService } from 'src/common/redis/redis.service';
import { BlogPostStatus } from 'src/generated/prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatedResponse } from 'src/types/paginated-response';
import { USER_SELECT_CONSTANT } from 'src/users/constants/user-select.constant';

import {
  BLOG_PUBLIC_DESCRIPTION,
  BLOG_PUBLIC_TITLE,
} from './constants/blog.constants';
import { BLOG_POST_AUTHOR_INCLUDE } from './constants/blog-post-include.constant';
import {
  ALL_BLOG_CACHE_KEY,
  BLOG_TTL,
  GET_BLOG_OVERVIEW_CACHE_KEY,
  GET_BLOG_POST_BY_SLUG_CACHE_KEY,
  GET_BLOG_POSTS_CACHE_KEY,
} from './constants/redis.constant';
import { BlogPostCreateDto } from './dto/blog-post-create.dto';
import { BlogPostQueryDto } from './dto/blog-post-query.dto';
import type {
  BlogOverview,
  BlogPostListItem,
  BlogPostWithAuthor,
  PublishedBlogPostWithAuthor,
} from './types';

@Injectable()
export class BlogService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redisService: RedisService,
  ) {}

  async getOverview(): Promise<BlogOverview> {
    const cached = await this.redisService.get<BlogOverview>(
      GET_BLOG_OVERVIEW_CACHE_KEY,
    );
    if (cached) {
      return cached;
    }

    const publishedPostsCount = await this.prisma.blogPost.count({
      where: { status: BlogPostStatus.PUBLISHED },
    });

    const overview: BlogOverview = {
      title: BLOG_PUBLIC_TITLE,
      description: BLOG_PUBLIC_DESCRIPTION,
      publishedPostsCount,
    };

    await this.redisService.set(
      GET_BLOG_OVERVIEW_CACHE_KEY,
      overview,
      BLOG_TTL,
    );

    return overview;
  }

  async getPublishedPosts(
    query: BlogPostQueryDto,
  ): Promise<PaginatedResponse<BlogPostListItem>> {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const where = { status: BlogPostStatus.PUBLISHED };

    const cacheKey = GET_BLOG_POSTS_CACHE_KEY(query);
    const cached =
      await this.redisService.get<PaginatedResponse<BlogPostListItem>>(
        cacheKey,
      );
    if (cached) {
      return cached;
    }

    const [rows, total] = await Promise.all([
      this.prisma.blogPost.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          excerpt: true,
          slug: true,
          createdAt: true,
          updatedAt: true,
          author: { select: USER_SELECT_CONSTANT },
        },
      }),
      this.prisma.blogPost.count({ where }),
    ]);

    const result: PaginatedResponse<BlogPostListItem> = {
      content: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 0,
    };

    await this.redisService.set(cacheKey, result, BLOG_TTL);

    return result;
  }

  async getPublishedPostBySlug(
    slug: string,
  ): Promise<PublishedBlogPostWithAuthor> {
    const cacheKey = GET_BLOG_POST_BY_SLUG_CACHE_KEY(slug);
    const cached =
      await this.redisService.get<PublishedBlogPostWithAuthor>(cacheKey);
    if (cached) {
      return cached;
    }

    const post = await this.prisma.blogPost.findFirst({
      where: {
        slug,
        status: BlogPostStatus.PUBLISHED,
      },
      include: BLOG_POST_AUTHOR_INCLUDE,
    });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    await this.redisService.set(cacheKey, post, BLOG_TTL);

    return post;
  }

  async createBlogPost(
    authorId: number,
    dto: BlogPostCreateDto,
  ): Promise<BlogPostWithAuthor> {
    const slugTaken = await this.prisma.blogPost.findUnique({
      where: { slug: dto.slug },
      select: { id: true },
    });
    if (slugTaken) {
      throw new ConflictException('A post with this slug already exists');
    }

    const post = await this.prisma.blogPost.create({
      data: {
        title: dto.title,
        slug: dto.slug,
        content: dto.content,
        excerpt: dto.excerpt,
        status: dto.status ?? BlogPostStatus.DRAFT,
        authorId,
      },
      include: BLOG_POST_AUTHOR_INCLUDE,
    });

    await this.redisService.deleteKeysByPattern(ALL_BLOG_CACHE_KEY);

    return post;
  }
}
