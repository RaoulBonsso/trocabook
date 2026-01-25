import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express from 'express';
import { AppModule } from './app.module';

const expressApp = express();
const adapter = new ExpressAdapter(expressApp);
let appPromise: Promise<any>;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, adapter);
  
  // Enable CORS
  app.enableCors();

  // Configure Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Trocabook')
    .setDescription('Trocabook API description')
    .setVersion('1.0.0')
    .addTag('books')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Trocabook API',
    customCssUrl: 'https://unpkg.com/swagger-ui-dist@5.31.0/swagger-ui.css',
    customJs: [
      'https://unpkg.com/swagger-ui-dist@5.31.0/swagger-ui-bundle.js',
      'https://unpkg.com/swagger-ui-dist@5.31.0/swagger-ui-standalone-preset.js',
    ],
  });

  await app.init();
  return expressApp;
}

export default async function handler(req: any, res: any) {
  if (!appPromise) {
    appPromise = bootstrap();
  }
  const app = await appPromise;
  app(req, res);
}
