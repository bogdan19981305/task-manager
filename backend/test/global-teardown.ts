import * as dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config({ path: '.env.test' });

export default async function globalTeardown() {
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
  await client.query(`DROP DATABASE IF EXISTS "${dbName}" WITH (FORCE)`);
  await client.end();

  console.log(`\n✓ Dropped test database: ${dbName}`);
}
