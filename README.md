# RYB - Rate Your Campus

A comprehensive API for rating campuses and lecturers, built with [NestJS](https://nestjs.com/) and TypeScript.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Database Setup](#database-setup)
- [Development Flow](#development-flow)
  - [Running the Application](#running-the-application)
  - [Available Scripts](#available-scripts)
  - [Testing](#testing)
  - [Code Quality](#code-quality)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
  - [Getting Started](#getting-started-1)
  - [Code Style](#code-style)
  - [Pull Request Process](#pull-request-process)
- [License](#license)

## Overview

RYB is a RESTful API that allows users to:

- Rate and review university campuses
- Rate and review lecturers/professors
- Search for campuses and lecturers
- User authentication via email/password or Google OAuth
- Email notifications and verification

### Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (v11)
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Authentication**: Better Auth with Google OAuth support
- **Email**: Nodemailer (SMTP) and Resend
- **API Documentation**: Swagger/OpenAPI
- **Testing**: Jest
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [pnpm](https://pnpm.io/) (v8 or higher)
- [MongoDB](https://www.mongodb.com/) (v5.0 or higher, local or cloud instance)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ryb
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

### Environment Setup

1. **Copy the environment example file**

   ```bash
   cp .env.example .env
   ```

2. **Configure your environment variables**

   Open `.env` and update the following variables:

   ```env
   # Database Configuration
   MONGO_URI=mongodb://localhost:27017/ryb

   # Email Configuration (SMTP)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   SMTP_REJECT_UNAUTHORIZED=true
   EMAIL_FROM=noreply@yourapp.com

   # Application Configuration
   BASE_URL=http://localhost:3000

   # Google OAuth Configuration
   GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

   **Note**: For Google OAuth, you'll need to create credentials in the [Google Cloud Console](https://console.cloud.google.com/).

### Database Setup

1. **Start MongoDB**

   If using a local MongoDB instance:

   ```bash
   # macOS (with Homebrew)
   brew services start mongodb-community

   # Linux (with systemd)
   sudo systemctl start mongod

   # Or use Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **Seed the database (optional)**

   ```bash
   pnpm run seed:universities
   ```

## Development Flow

### Running the Application

Choose the mode that fits your development needs:

```bash
# Development mode (with hot-reload)
pnpm run start:dev

# Production mode
pnpm run build
pnpm run start:prod

# Debug mode
pnpm run start:debug
```

The API will be available at `http://localhost:3000` by default.

### Available Scripts

| Script                       | Description                            |
| ---------------------------- | -------------------------------------- |
| `pnpm run build`             | Build the application for production   |
| `pnpm run start`             | Run the application                    |
| `pnpm run start:dev`         | Run in development mode with watch     |
| `pnpm run start:prod`        | Run the production build               |
| `pnpm run seed:universities` | Seed the database with university data |
| `pnpm run lint`              | Run ESLint with auto-fix               |
| `pnpm run format`            | Format code with Prettier              |
| `pnpm run test`              | Run unit tests                         |
| `pnpm run test:watch`        | Run tests in watch mode                |
| `pnpm run test:cov`          | Run tests with coverage report         |
| `pnpm run test:e2e`          | Run end-to-end tests                   |

### Testing

We use Jest for testing. Test files should be co-located with the code they test and follow the naming convention `*.spec.ts`.

```bash
# Run all unit tests
pnpm run test

# Run tests in watch mode (useful during development)
pnpm run test:watch

# Generate coverage report
pnpm run test:cov

# Run end-to-end tests
pnpm run test:e2e
```

### Code Quality

Before committing, ensure your code passes quality checks:

```bash
# Run linter
pnpm run lint

# Format code
pnpm run format
```

## API Documentation

Once the application is running, you can access the interactive API documentation (Swagger UI) at:

```
http://localhost:3000/api
```

This provides a complete reference for all available endpoints, request/response schemas, and allows you to test the API directly from the browser.

## Project Structure

```
ryb/
├── src/
│   ├── auth/              # Authentication configuration
│   ├── campus/            # Campus CRUD operations
│   ├── campus-rating/     # Campus rating logic
│   ├── lecturer/          # Lecturer CRUD operations
│   ├── lecturer-rating/   # Lecturer rating logic
│   ├── schema/            # Mongoose schemas
│   ├── scripts/           # Database seeding scripts
│   ├── search/            # Search functionality
│   ├── swagger/           # Swagger configuration
│   ├── app.module.ts      # Root application module
│   └── main.ts            # Application entry point
├── test/                  # E2E tests
├── .env.example           # Environment variables template
├── .eslintrc.js          # ESLint configuration
├── .prettierrc           # Prettier configuration
├── nest-cli.json         # NestJS CLI configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## Contributing

We welcome contributions from the community! Here's how you can help:

### Getting Started

1. **Fork the repository**

   Click the "Fork" button on GitHub to create your own copy.

2. **Clone your fork**

   ```bash
   git clone https://github.com/your-username/ryb.git
   cd ryb
   ```

3. **Add the upstream remote**

   ```bash
   git remote add upstream https://github.com/original-owner/ryb.git
   ```

4. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

### Code Style

We follow these conventions:

- **TypeScript**: Strict mode enabled
- **Linting**: ESLint with recommended rules
- **Formatting**: Prettier with default configuration
- **Naming**:
  - Use PascalCase for classes, interfaces, types
  - Use camelCase for variables, functions, methods
  - Use kebab-case for file names

Before submitting:

```bash
# Ensure all checks pass
pnpm run lint
pnpm run format
pnpm run test
```

### Pull Request Process

1. **Keep your branch updated**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Make your changes**
   - Write clear, concise commit messages
   - Add tests for new features
   - Update documentation as needed

3. **Test your changes**

   ```bash
   pnpm run test
   pnpm run test:e2e
   ```

4. **Submit your pull request**
   - Provide a clear description of the changes
   - Reference any related issues
   - Ensure all CI checks pass

5. **Code Review**
   - Address review comments promptly
   - Be open to feedback and suggestions

### Commit Message Guidelines

We follow conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Example:

```
feat: add search by lecturer department

- Implement department filter in search endpoint
- Add index for department field
- Update API documentation
```

## License

This project is [UNLICENSED](LICENSE).

---

<p align="center">Built with NestJS</p>
