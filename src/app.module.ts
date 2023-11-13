import { Module } from '@nestjs/common';
import appConfig from './config/app.config';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DrizzleModule } from './modules/drizzle/drizzle.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RoleModule } from './modules/role/role.module';
import { OnAppInitModule } from './modules/on-app-init/on-app-init.module';
import { JwtAndRoleGuard } from './modules/auth/guards/jwt-and-role.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    DrizzleModule,
    UsersModule,
    AuthModule,
    RoleModule,
    OnAppInitModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAndRoleGuard,
    },
  ],
})
export class AppModule {}
