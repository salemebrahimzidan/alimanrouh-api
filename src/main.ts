import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import { join } from 'path';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const httpAdapter = app.getHttpAdapter().getInstance();

  httpAdapter.set('trust proxy', 1);
  httpAdapter.disable('x-powered-by');

  app.use(helmet());
  app.use(compression());

  app.use('/uploads', express.static(join(process.cwd(), 'uploads')));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: [
     'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    'https://alimanrouh-admin.vercel.app',
    'https://alimanrouh.com',
    'https://www.alimanrouh.com',
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Al Iman Rouh API')
    .setDescription('Backend API for Al Iman Rouh Platform')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3000;

  await app.listen(port);

  console.log(`🚀 Server: http://localhost:${port}`);
  console.log(`📚 Swagger: http://localhost:${port}/api/docs`);
}

bootstrap();