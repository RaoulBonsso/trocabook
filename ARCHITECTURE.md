# Trocabook Backend Architecture

## Overview
This project is a NestJS-based backend application designed for scalability, maintainability, and ease of deployment. It uses a modular architecture to separate concerns and ensure clean code.

## Key Technologies
- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Firebase Admin**: Used for authentication and other Firebase services.
- **Docker**: Containerization for consistent deployment across any environment.
- **TypeScript**: Typed JavaScript for better developer experience and code safety.

## Module Structure

### 1. AppModule (`src/app.module.ts`)
The root module of the application. It imports all other modules and configures global settings like `ConfigModule` for environment variables.

### 2. AuthModule (`src/auth`)
Handles user authentication and authorization.
- **AuthService**: Contains logic for login, logout, and token management.
- **AuthController**: Exposes API endpoints for authentication (`/auth/login`, `/auth/logout`).
- **AuthGuard**: Protects routes that require a valid JWT token.

### 3. UsersModule (`src/users`)
Manages user data.
- **UsersService**: interacting with the database (currently mocked or simple) to find or create users.
- **DTOs**: Data Transfer Objects (`LoginDto`, `RegisterUserDto`) ensure that data sent to the API is valid.

### 4. FirebaseModule (`src/firebase`)
Encapsulates Firebase interactions.
- **Configuration**: Automatically handles credentials. It supports:
    - JSON string in `FIREBASE_ADMIN_CREDENTIALS` (env var).
    - File path to credentials file.
    - Base64 encoded JSON string (ideal for production/Docker).

## Deployment (Docker)
The application is Dockerized to ensure it runs the same way on every machine.

### How to Run with Docker
1. **Build and Run**:
   ```bash
   docker compose up --build
   ```
2. **Environment Variables**:
   Ensure you have a `.env` file with:
   ```
   FIREBASE_API_KEY=...
   FIREBASE_ADMIN_CREDENTIALS=...
   ```

## Development Best Practices
- **Validation**: All inputs are validated using `class-validator` via Global Pipes.
- **Configuration**: Use `ConfigService` to access environment variables.
- **Dependency Injection**: Use NestJS DI to manage service dependencies.

## Beginner's Guide
- **Services** hold business logic.
- **Controllers** handle HTTP requests and responses.
- **Modules** group related features.
- Always create a **DTO** for POST/PUT requests to validate data structure.
