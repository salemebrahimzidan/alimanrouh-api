import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';

import { PrismaModule } from './database/prisma/prisma.module';

import { AuthModule } from './modules/auth/auth.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { ContactModule } from './modules/contact/contact.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { MailModule } from './modules/mail/mail.module';
import { PackagesModule } from './modules/packages/packages.module';
import { UploadModule } from './modules/upload/upload.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    PrismaModule,

    AuthModule,
    PackagesModule,
    BookingsModule,
    ContactModule,
    UsersModule,
    DashboardModule,
    UploadModule,
    MailModule,
  ],
})
export class AppModule {}