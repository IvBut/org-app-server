import { Module } from '@nestjs/common';
import { CvModule } from './cv/cv.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './modules/prisma/prisma.service';
import { PrismaModule } from './modules/prisma/prisma.module';
import appConfig from './config/app.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    PrismaModule,
    CvModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
