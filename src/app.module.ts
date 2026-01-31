import { Module } from '@nestjs/common';
import { MongooseModule, getConnectionToken } from '@nestjs/mongoose';
import { LecturerModule } from './lecturer/lecturer.module';
import { CampusModule } from './campus/campus.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import { Connection } from 'mongoose';

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
      useFactory: (connection: Connection) => {
        return {
          auth: betterAuth({
            database: mongodbAdapter(connection.db!),
            emailAndPassword: {
              enabled: true,
            },
          }),
          disableGlobalAuthGuard: true,
        };
      },
      inject: [getConnectionToken()],
    }),
    LecturerModule,
    CampusModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
