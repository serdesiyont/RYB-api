import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authDocumentation } from './swagger/auth.document';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  const configService = app.get(ConfigService);
  const corsOrigins = (configService.get<string>('CORS_ORIGINS') || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const resolvedCorsOrigins = corsOrigins.length
    ? corsOrigins
    : ['http://localhost:4000'];

  app.enableCors({
    origin: resolvedCorsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const swaggerEnabled =
    configService.get<string>('SWAGGER_ENABLED') !== 'false';
  if (swaggerEnabled) {
    const config = new DocumentBuilder()
      .setTitle('RYB API')
      .setDescription('The RYB API description')
      .setVersion('1.0')
      .addTag('auth', 'Authentication endpoints')
      .build();
    const document = SwaggerModule.createDocument(app, config);

    // Add Better Auth endpoints to Swagger
    document.paths = { ...document.paths, ...authDocumentation };

    SwaggerModule.setup('api', app, document);
  }

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
}
void bootstrap();
