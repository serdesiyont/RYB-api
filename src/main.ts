import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authDocumentation } from './swagger/auth.document';

const getRequiredEnv = (configService: ConfigService, key: string): string => {
  const value = configService.get<string>(key);
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value.trim();
};

const getRequiredPort = (configService: ConfigService): number => {
  const value = getRequiredEnv(configService, 'PORT');
  const port = Number.parseInt(value, 10);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error('Environment variable PORT must be a positive integer');
  }

  return port;
};

const getRequiredBoolean = (
  configService: ConfigService,
  key: string,
): boolean => {
  const value = getRequiredEnv(configService, key).toLowerCase();

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new Error(
    `Environment variable ${key} must be either "true" or "false"`,
  );
};

const parseRequiredOriginList = (
  configService: ConfigService,
  key: string,
): string[] => {
  const value = getRequiredEnv(configService, key);
  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (!origins.length) {
    throw new Error(
      `Environment variable ${key} must contain at least one origin`,
    );
  }

  return origins;
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  const configService = app.get(ConfigService);
  const corsOrigins = parseRequiredOriginList(configService, 'CORS_ORIGINS');

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  const swaggerEnabled = getRequiredBoolean(configService, 'SWAGGER_ENABLED');
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

  const port = getRequiredPort(configService);
  await app.listen(port);
}
void bootstrap();
