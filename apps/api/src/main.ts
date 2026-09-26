import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configureApp } from './app.setup';
import { setupSwagger, SWAGGER_PATH } from './common/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const swaggerEnabled = process.env.NODE_ENV !== 'production' || process.env.SWAGGER_ENABLED === 'true';
  if (swaggerEnabled) setupSwagger(app);

  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);
  Logger.log(`API listening on http://localhost:${port}`, 'Bootstrap');
  if (swaggerEnabled) Logger.log(`Swagger UI at http://localhost:${port}/${SWAGGER_PATH}`, 'Bootstrap');
}

void bootstrap();
