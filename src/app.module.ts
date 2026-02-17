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
        return {
          auth: createAuthConfig(
            connection,
            {
              clientId: getRequiredEnv(configService, 'MAIL_GOOGLE_CLIENT_ID'),
              clientSecret: getRequiredEnv(
                configService,
                'MAIL_GOOGLE_CLIENT_SECRET',
              ),
              refreshToken: getRequiredEnv(
                configService,
                'MAIL_GOOGLE_REFRESH_TOKEN',
              ),
              redirectUri: getRequiredEnv(
                configService,
                'MAIL_GOOGLE_REDIRECT_URI',
              ),
              user: getRequiredEnv(configService, 'EMAIL_FROM'),
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
