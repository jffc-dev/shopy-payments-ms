import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('main');

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);

  logger.log(`Payments microservice is running on: ${envs.port}`);
}
bootstrap();
