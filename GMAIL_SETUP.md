# Gmail API Email Sending Configuration

This project uses Gmail API with OAuth2 for sending verification emails.

## Current Configuration

The application is configured to send emails using Gmail API with OAuth2 authentication. Your current authenticated Gmail account is:

- **Email:** successinternationalagency@gmail.com

## Key Points

1. **Authentication:** Uses OAuth2 with a refresh token for secure authentication
2. **Email Sender:** Emails must be sent from the authenticated Gmail account
3. **Gmail API:** Uses the official Gmail API instead of SMTP for better reliability

## Environment Variables Required

```bash
# Gmail OAuth2 Configuration
MAIL_GOOGLE_CLIENT_ID=your-client-id
MAIL_GOOGLE_CLIENT_SECRET=your-client-secret
MAIL_GOOGLE_REFRESH_TOKEN=your-refresh-token
MAIL_GOOGLE_REDIRECT_URI=https://developers.google.com/oauthplayground

# Sender Email (must match authenticated account)
EMAIL_FROM=successinternationalagency@gmail.com
```

## Testing Gmail OAuth2

Run the test script to verify your Gmail OAuth2 credentials:

```bash
pnpm run test:gmail
```

This will:

- Verify your OAuth2 credentials
- Test the access token generation
- Connect to Gmail API
- Display your Gmail account information

## How Email Sending Works

1. The OAuth2 client is created with your credentials
2. A refresh token is used to obtain a temporary access token
3. The Gmail API is used to send emails directly
4. Emails are formatted in HTML and sent via the Gmail API v1

## Important Notes

⚠️ **Email Address Matching:** The `EMAIL_FROM` environment variable MUST match the email address of the authenticated Gmail account. Gmail will reject emails sent from a different address.

✅ **Current Setup:** Your configuration is correct:

- Authenticated account: `successinternationalagency@gmail.com`
- EMAIL_FROM: `successinternationalagency@gmail.com`

## Generating a New Refresh Token

If you need to generate a new refresh token:

1. Visit [Google OAuth Playground](https://developers.google.com/oauthplayground)
2. Click the settings icon (⚙️) in the top right
3. Check "Use your own OAuth credentials"
4. Enter your Client ID and Client Secret
5. In Step 1, select: **Gmail API v1** → `https://www.googleapis.com/auth/gmail.send`
6. Click "Authorize APIs" and sign in with your Gmail account
7. In Step 2, click "Exchange authorization code for tokens"
8. Copy the **Refresh token** and update your `.env` file

## Gmail API Requirements

Make sure the following are enabled in your Google Cloud Console:

1. **Gmail API** is enabled for your project
2. **OAuth 2.0 credentials** are configured
3. The OAuth consent screen is set up
4. The scope `https://www.googleapis.com/auth/gmail.send` is authorized

## Troubleshooting

### Error: "Username and Password not accepted"

This error occurs when:

- The refresh token is expired or invalid
- The email address doesn't match the authenticated account
- The Gmail API is not enabled

**Solution:**

- Verify `EMAIL_FROM` matches your authenticated Gmail account
- Run `pnpm run test:gmail` to test your credentials
- Generate a new refresh token if needed

### Error: "Failed to obtain access token"

This error occurs when:

- Invalid OAuth2 credentials
- Refresh token has been revoked

**Solution:**

- Check your Client ID and Client Secret
- Generate a new refresh token

## Implementation Details

The email sending is implemented in:

- `src/auth/email.ts` - Gmail API integration
- `src/auth/auth.config.ts` - Better-auth email verification configuration
- `src/app.module.ts` - Gmail configuration initialization

The implementation uses the `googleapis` package to interact with Gmail API directly, providing better error handling and reliability compared to SMTP.
