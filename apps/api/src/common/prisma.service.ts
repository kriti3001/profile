import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';

// Connects lazily on the first query, so the app still boots if the database is unreachable.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  constructor(config: ConfigService) {
    super({
      adapter: new PrismaPg({
        connectionString: config.getOrThrow<string>('DATABASE_URL'),
        // Opening a connection to Azure PostgreSQL takes ~1.5s (TLS), so keep idle connections for
        // 5 minutes instead of pg's 10s default, with TCP keep-alive so they aren't silently dropped.
        idleTimeoutMillis: 5 * 60_000,
        keepAlive: true,
      }),
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
