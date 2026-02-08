import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { LecturerModule } from './lecturer/lecturer.module';
import { CampusModule } from './campus/campus.module';
import { CampusRatingModule } from './campus-rating/campus-rating.module';
import { LecturerRatingModule } from './lecturer-rating/lecturer-rating.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { Connection } from 'mongoose';
import { createAuthConfig } from './auth/auth.config';
import { AuthController } from './auth/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    AuthModule.forRootAsync({
      useFactory: (connection: Connection, configService: ConfigService) => {
        const smtpPort = configService.get<number>('SMTP_PORT') || 587;
        const smtpSecure = smtpPort === 465; // Port 465 uses SSL, port 587 uses STARTTLS

        return {
          auth: createAuthConfig(
            connection,
            {
              host: configService.get<string>('SMTP_HOST')!,
              port: smtpPort,
              secure: smtpSecure,
              requireTLS: !smtpSecure, // Use STARTTLS for port 587
              auth: {
                user: configService.get<string>('SMTP_USER')!,
                pass: configService.get<string>('SMTP_PASS')!,
              },
              tls: {
                rejectUnauthorized:
                  configService.get<boolean>('SMTP_REJECT_UNAUTHORIZED') !==
                  false,
              },
            },
            configService.get<string>('EMAIL_FROM')!,
            configService.get<string>('BASE_URL') || 'http://localhost:3000',
          ),
        };
      },
      inject: [getConnectionToken(), ConfigService],
    }),
    LecturerModule,
    CampusModule,
    CampusRatingModule,
    LecturerRatingModule,
  ],
  controllers: [AuthController],
  providers: [],
})
export class AppModule {}
