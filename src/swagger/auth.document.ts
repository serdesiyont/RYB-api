export const authDocumentation = {
  '/api/auth/sign-up/email': {
    post: {
      tags: ['auth'],
      summary: 'Sign up with email and password',
      operationId: 'signUp',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password', 'name'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com',
                },
                password: {
                  type: 'string',
                  format: 'password',
                  example: 'Password123!',
                },
                name: { type: 'string', example: 'John Doe' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description:
            'User successfully created. A verification email has been sent.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      name: { type: 'string' },
                      emailVerified: { type: 'boolean' },
                    },
                  },
                  session: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                      expiresAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
        '400': { description: 'Bad request - Invalid input data' },
      },
    },
  },
  '/api/auth/sign-in/email': {
    post: {
      tags: ['auth'],
      summary: 'Sign in with email and password',
      operationId: 'signIn',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com',
                },
                password: {
                  type: 'string',
                  format: 'password',
                  example: 'Password123!',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Successfully signed in',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  user: {
                    type: 'object',
                    properties: {
                      id: { type: 'string' },
                      email: { type: 'string' },
                      name: { type: 'string' },
                      emailVerified: { type: 'boolean' },
                    },
                  },
                  session: {
                    type: 'object',
                    properties: {
                      token: { type: 'string' },
                      expiresAt: { type: 'string', format: 'date-time' },
                    },
                  },
                },
              },
            },
          },
        },
        '401': { description: 'Unauthorized - Invalid credentials' },
        '403': { description: 'Email not verified' },
      },
    },
  },
  '/api/auth/send-verification-email': {
    post: {
      tags: ['auth'],
      summary: 'Send verification email',
      operationId: 'sendVerificationEmail',
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  example: 'user@example.com',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Verification email sent successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        '400': { description: 'Bad request - Invalid email' },
        '404': { description: 'User not found' },
      },
    },
  },
  '/api/auth/verify-email': {
    get: {
      tags: ['auth'],
      summary: 'Verify email address',
      operationId: 'verifyEmail',
      parameters: [
        {
          name: 'token',
          in: 'query' as const,
          required: true,
          schema: {
            type: 'string',
          },
          description: 'Email verification token from the verification email',
        },
      ],
      responses: {
        '200': {
          description: 'Email verified successfully',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        '400': { description: 'Invalid or expired token' },
      },
    },
  },
  '/api/auth/sign-out': {
    post: {
      tags: ['auth'],
      summary: 'Sign out the current user',
      operationId: 'signOut',
      description: 'Logs out the current user and clears their session',
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Successfully signed out. Session cleared.',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Logged out successfully',
                  },
                },
              },
            },
          },
        },
        '401': {
          description: 'Unauthorized - No active session',
        },
      },
    },
  },
};
