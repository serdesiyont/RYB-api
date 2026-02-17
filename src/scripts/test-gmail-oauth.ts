import { google } from 'googleapis';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function testGmailOAuth() {
  try {
    console.log('Testing Gmail OAuth2 credentials...\n');

    const clientId = process.env.MAIL_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.MAIL_GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.MAIL_GOOGLE_REFRESH_TOKEN;
    const redirectUri = process.env.MAIL_GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !refreshToken || !redirectUri) {
      throw new Error('Missing required Gmail OAuth2 environment variables');
    }

    console.log('Client ID:', clientId.substring(0, 20) + '...');
    console.log('Redirect URI:', redirectUri);
    console.log('Refresh Token:', refreshToken.substring(0, 20) + '...\n');

    // Create OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri,
    );

    // Set refresh token
    oauth2Client.setCredentials({
      refresh_token: refreshToken,
    });

    console.log('Attempting to get access token...');

    // Get access token
    const tokenResponse = await oauth2Client.getAccessToken();

    if (tokenResponse.token) {
      console.log('✅ Successfully obtained access token!');
      console.log(
        'Access token:',
        tokenResponse.token.substring(0, 20) + '...\n',
      );

      // Test Gmail API connection
      console.log('Testing Gmail API connection...');
      const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

      const profile = await gmail.users.getProfile({ userId: 'me' });
      console.log('✅ Successfully connected to Gmail API!');
      console.log('Email address:', profile.data.emailAddress);
      console.log('Total messages:', profile.data.messagesTotal);
      console.log(
        '\n🎉 All tests passed! Your Gmail OAuth2 credentials are working correctly.',
      );
    } else {
      console.error('❌ Failed to obtain access token');
    }
  } catch (error) {
    console.error('\n❌ Error testing Gmail OAuth2:');
    if (error instanceof Error) {
      console.error('Message:', error.message);
    }
    console.error('\nFull error:', error);

    console.log('\n📝 Troubleshooting steps:');
    console.log(
      '1. Make sure you have enabled the Gmail API in Google Cloud Console',
    );
    console.log('2. Verify that your OAuth2 credentials are correct');
    console.log(
      '3. Check that the refresh token has the correct scopes (https://www.googleapis.com/auth/gmail.send)',
    );
    console.log(
      '4. Generate a new refresh token if the current one is expired',
    );
    console.log('\nTo generate a new refresh token, visit:');
    console.log('https://developers.google.com/oauthplayground');
    console.log('- Click settings icon (top right)');
    console.log('- Check "Use your own OAuth credentials"');
    console.log('- Enter your Client ID and Client Secret');
    console.log(
      '- In Step 1, select "Gmail API v1" -> "https://www.googleapis.com/auth/gmail.send"',
    );
    console.log('- Authorize and get the refresh token from Step 2');

    process.exit(1);
  }
}

testGmailOAuth();
