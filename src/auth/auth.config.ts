import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import type { Connection } from 'mongoose';
import { SmtpConfig, sendEmail } from './email';

export const createAuthConfig = (
  connection: Connection,
  smtpConfig: SmtpConfig,
  emailFrom: string,
  baseUrl: string,
) => {
  return betterAuth({
    baseURL: baseUrl,
    cors: {
      origin: ['http://localhost:4000'],
      credentials: true,
    },
    database: mongodbAdapter(connection.db!),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        // don't await the sendEmail function, trust me bro
        sendEmail({
          smtpConfig,
          from: emailFrom,
          to: user.email,
          url,
        });
      },
    },
  });
};
