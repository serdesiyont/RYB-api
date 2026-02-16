import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { LecturerModule } from './lecturer/lecturer.module';
import { CampusModule } from './campus/campus.module';
import { CampusRatingModule } from './campus-rating/campus-rating.module';
import { LecturerRatingModule } from './lecturer-rating/lecturer-rating.module';
import { SearchModule } from './search/search.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { Connection } from 'mongoose';
import { createAuthConfig } from './auth/auth.config';

const getRequiredEnv = (configService: ConfigService, key: string): string => {
  const value = configService.get<string>(key);
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${key}`);
  }

  return value.trim();
};

const getRequiredNumber = (
  configService: ConfigService,
  key: string,
): number => {
  const value = getRequiredEnv(configService, key);
  const parsed = Number.parseInt(value, 10);

  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }

  return parsed;
};

const getRequiredBoolean = (
  configService: ConfigService,
  key: string,
): boolean => {
  const value = getRequiredEnv(configService, key).toLowerCase();

  if (value === 'true') {
    return true;
  }

  if (value === 'false') {
    return false;
  }

  throw new Error(
    `Environment variable ${key} must be either "true" or "false"`,
  );
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const mongoUri = getRequiredEnv(configService, 'MONGO_URI');
        return {
          uri: mongoUri,
        };
      },
      inject: [ConfigService],
    }),
    AuthModule.forRootAsync({
      useFactory: (connection: Connection, configService: ConfigService) => {
        const smtpPort = getRequiredNumber(configService, 'SMTP_PORT');
        const smtpSecure = getRequiredBoolean(configService, 'SMTP_SECURE');

        return {
          auth: createAuthConfig(
            connection,
            {
              host: getRequiredEnv(configService, 'SMTP_HOST'),
              port: smtpPort,
              secure: smtpSecure,
              requireTLS: !smtpSecure,
              auth: {
                user: getRequiredEnv(configService, 'SMTP_USER'),
                pass: getRequiredEnv(configService, 'SMTP_PASS'),
              },
              tls: {
                rejectUnauthorized: getRequiredBoolean(
                  configService,
                  'SMTP_REJECT_UNAUTHORIZED',
                ),
              },
            },
            getRequiredEnv(configService, 'EMAIL_FROM'),
            getRequiredEnv(configService, 'BASE_URL'),
            getRequiredEnv(configService, 'VERIFICATION_CALLBACK_URL'),
            getRequiredEnv(configService, 'GOOGLE_CLIENT_ID'),
            getRequiredEnv(configService, 'GOOGLE_CLIENT_SECRET'),
          ),
        };
      },
      inject: [getConnectionToken(), ConfigService],
    }),
    LecturerModule,
    CampusModule,
    CampusRatingModule,
    LecturerRatingModule,
    SearchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
