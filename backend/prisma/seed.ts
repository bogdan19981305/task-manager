import { randomBytes } from 'node:crypto';
import path from 'node:path';

import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

import { PrismaClient } from '../src/generated/prisma/client';
import { BlogPostStatus, Role } from '../src/generated/prisma/enums';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

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
