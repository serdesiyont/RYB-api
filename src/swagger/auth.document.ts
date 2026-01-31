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
          description: 'User successfully created',
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
      },
    },
  },
};
