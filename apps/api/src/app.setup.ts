import { INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaExceptionFilter } from './common/prisma-exception.filter';

/** App-wide middleware, pipes and filters. Shared by main.ts and any test harness. */
export function configureApp(app: INestApplication) {
  // Browser origins allowed to call the API (the Next.js frontend). Comma-separated.
  const origins = (process.env.CORS_ORIGINS || 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({ origin: origins });

  // Reject unknown fields (e.g. a client-supplied ownerId) and convert query strings to numbers/enums.
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.useGlobalFilters(new PrismaExceptionFilter(app.get(HttpAdapterHost).httpAdapter));
}
