import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from './config/app.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const { PORT, HOST } = configService.get<IAppConfig>('app');

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');
  await app.listen(PORT, HOST, () => {
    console.log(`Nest listening on http://${HOST}:${PORT}`, 'Bootstrap');
  });
}
bootstrap();
