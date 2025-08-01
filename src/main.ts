import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('My first app')
    .setDescription('First config!!!')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  // app.get(ConfigService);
  console.log('Port: ', process.env.PORT);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3010);
}
bootstrap();
