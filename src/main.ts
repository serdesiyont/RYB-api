import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { authDocumentation } from './swagger/auth.document';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: false,
  });

  app.useGlobalPipes(new ValidationPipe());

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

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
