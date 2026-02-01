import * as nodemailer from 'nodemailer';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  requireTLS?: boolean;
  tls?: {
    rejectUnauthorized: boolean;
  };
}

export async function sendEmail({
  smtpConfig,
  from,
  to,
  url,
}: {
  smtpConfig: SmtpConfig;
  from: string;
  to: string;
  url: string;
}) {
  try {
    const transporter = nodemailer.createTransport(smtpConfig);
    return await transporter.sendMail({
      from,
      to,
      subject: 'Verify your email address',
      html: `<p>Click <a href="${url}">here</a> to verify your email address.</p>`,
      text: `Click the link to verify your email: ${url}`,
    });
  } catch (error) {
    console.error('Failed to send verification email:', error);
  }
}
