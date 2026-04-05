import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const configService = new ConfigService();
  const frontendUrl = configService.getOrThrow<string>('FRONTEND_URL');
  const port = configService.getOrThrow<number>('PORT');
  const nodeEnv = configService.getOrThrow<string>('NODE_ENV');
  const app = await NestFactory.create(AppModule, {
    rawBody: true,
  });

  if (nodeEnv === 'development') {
    const config = new DocumentBuilder()
      .setTitle('API')
      .setDescription('API description')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
  }
  app.use(cookieParser());
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
  });
  await app.listen(port || 3000);
}
void bootstrap();
