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
    database: mongodbAdapter(connection.db!),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    emailVerification: {
      sendVerificationEmail: async ({ user, url }) => {
        // don't await the email sending
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
