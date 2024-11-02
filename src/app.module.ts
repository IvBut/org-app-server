import { Module } from '@nestjs/common';
import { CvModule } from './cv/cv.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    CvModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
