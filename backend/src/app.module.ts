import { type DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegisterModule } from './auth/register/register.module';
import { PrismaModule } from './prisma/prisma.module';

type ConfigModuleLike = {
  forRoot: (options: {
    isGlobal: boolean;
    envFilePath?: string;
  }) => DynamicModule;
};

const typedConfigModule = ConfigModule as unknown as ConfigModuleLike;

@Module({
  imports: [
    PrismaModule,
    RegisterModule,
    typedConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
