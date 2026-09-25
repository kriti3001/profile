// Connectivity smoke test: `npm run db:check -w api`.
// Connects with DATABASE_URL from apps/api/.env and counts rows in User.
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const prisma = new PrismaClient({ adapter });
  try {
    const users = await prisma.user.count();
    console.log(`Connected to database. User rows: ${users}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('Database check failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
