import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Client } from 'pg';

dotenv.config({ path: path.resolve(__dirname, '.env.test') });

export default async function globalSetup() {
  const dbUrl = new URL(process.env.DATABASE_URL!);
  const dbName = dbUrl.pathname.slice(1);

  const client = new Client({
    host: dbUrl.hostname,
    port: Number(dbUrl.port),
    user: dbUrl.username,
    password: dbUrl.password,
    database: 'postgres',
  });

  await client.connect();

  const { rows } = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = $1`,
    [dbName],
  );

  if (rows.length === 0) {
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`\n✓ Created test database: ${dbName}`);
  }

  await client.end();

  execSync('pnpm prisma migrate deploy', {
    env: { ...process.env },
    stdio: 'inherit',
  });
}
