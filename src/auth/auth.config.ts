import { betterAuth } from 'better-auth';
import { mongodbAdapter } from 'better-auth/adapters/mongodb';
import type { Connection } from 'mongoose';
import { GmailConfig, sendEmailWithGmail } from './email';

export const createAuthConfig = (
  connection: Connection,
  gmailConfig: GmailConfig,
  emailFrom: string,
  baseUrl: string,
  verificationCallbackUrl: string,
  googleClientId: string,
  googleClientSecret: string,
) => {
  return betterAuth({
    rateLimit: {
      enabled: true,
      window: 60,
      max: 100,
      customRules: {
        '/search': { window: 10, max: 100 },
      },
    },
    baseURL: baseUrl,
    trustedOrigins: [
      'https://rate-your-professor.vercel.app',
      'http://localhost:4000',
    ],
    cors: {
      origin: true,
      credentials: true,
    },
    database: mongodbAdapter(connection.db!),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    emailVerification: {
      sendOnSignUp: true,
      sendVerificationEmail: ({ user, token }) => {
        // Construct the verification URL with token and callback URL
        const encodedCallbackURL = encodeURIComponent(verificationCallbackUrl);
        const verificationUrl = `${baseUrl}/api/auth/verify-email?token=${token}&callbackURL=${encodedCallbackURL}`;

        // Send email using Gmail API
        return sendEmailWithGmail({
          gmailConfig,
          from: emailFrom,
          to: user.email,
          url: verificationUrl,
        }).then(() => undefined);
      },
      autoSignInAfterVerification: true,
    },
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        redirectURI: `${baseUrl}/api/auth/callback/google`,
      },
    },
  });
};
