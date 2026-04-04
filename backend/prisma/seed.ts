import { randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

import { PrismaClient } from '../src/generated/prisma/client';
import { BlogPostStatus, Role } from '../src/generated/prisma/enums';

const backendRoot = path.join(__dirname, '..');

/**
 * Loads env files without overriding variables already set (e.g. by Docker Compose).
 * Production: `.env.prod.docker` then `.env`.
 * Otherwise: `.env.docker` then `.env` (local Docker), then `.env.prod.docker` if `DATABASE_URL` is still missing.
 * Override with absolute/relative path: `PRISMA_SEED_ENV_FILE=.env.prod.docker pnpm db:seed`
 */
function loadEnvForSeed(): void {
  const explicit = process.env.PRISMA_SEED_ENV_FILE;
  if (explicit) {
    const resolved = path.isAbsolute(explicit)
      ? explicit
      : path.join(backendRoot, explicit);
    if (!fs.existsSync(resolved)) {
      throw new Error(
        `PRISMA_SEED_ENV_FILE points to missing file: ${resolved}`,
      );
    }
    dotenv.config({ path: resolved, override: true });
    return;
  }

  const tryLoad = (filename: string) => {
    const full = path.join(backendRoot, filename);
    if (fs.existsSync(full)) {
      dotenv.config({ path: full, override: false });
    }
  };

  if (process.env.NODE_ENV === 'production') {
    tryLoad('.env.prod.docker');
    tryLoad('.env');
  } else {
    tryLoad('.env.docker');
    tryLoad('.env');
  }

  if (!process.env.DATABASE_URL) {
    tryLoad('.env.prod.docker');
  }
}

loadEnvForSeed();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL is required to run the seed');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const TITLE_PREFIXES = [
  'Notes on',
  'Deep dive:',
  'Quick guide:',
  'Thoughts about',
  'Lessons from',
];

const TITLE_TOPICS = [
  'task workflows',
  'team habits',
  'shipping safely',
  'async collaboration',
  'focus and context switching',
  'API design',
  'caching strategies',
];

const pick = <T>(items: readonly T[]): T =>
  items[Math.floor(Math.random() * items.length)];

async function main() {
  const admin = await prisma.user.findFirst({
    where: { role: Role.ADMIN },
    orderBy: { id: 'asc' },
  });

  if (!admin) {
    throw new Error(
      'No user with ADMIN role found. Create an admin user first, then re-run the seed.',
    );
  }

  for (let i = 0; i < 3; i++) {
    const suffix = randomBytes(3).toString('hex');
    const slug = `seed-${suffix}-${i}`;
    const title = `${pick(TITLE_PREFIXES)} ${pick(TITLE_TOPICS)}`;
    const excerpt = `Short preview for "${title}" — generated for local testing.`;
    const content = [
      `# ${title}`,
      '',
      'This is **sample content** created by the database seed.',
      '',
      `- Random block ${suffix}`,
      `- Index ${i + 1} of 3`,
    ].join('\n');

    await prisma.blogPost.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        status: BlogPostStatus.PUBLISHED,
        authorId: admin.id,
      },
    });
  }

  console.log(
    `Seeded 3 blog posts for admin user id=${admin.id} (${admin.email ?? 'no email'}).`,
  );
}

void main()
  .catch((e: unknown) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
