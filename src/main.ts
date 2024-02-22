import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);

  app.use(cookieParser());
  app.enableCors({ origin: (origin, cb) => cb(null, true) });
  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.setGlobalPrefix('api/v1');

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Linkedin Clone API')
    .setDescription(
      'A RESTful API app that provide some social media functionalities',
    )
    .setVersion('1.0')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api-docs', app, swaggerDocument);

  const port = config.get('app.port');

  await app.listen(port, () =>
    console.log(`Server is listening on port ${port}`),
  );
}
bootstrap();
