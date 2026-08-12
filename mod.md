# Production Environment Variables Report

Below is the list of every environment variable required by the backend application for a production deployment.

## Required Environment Variables

### DATABASE_URL
*   **Where it is used**: `backend/src/lib/prisma.ts`, `backend/src/app.module.ts`
*   **Purpose**: The primary connection string for Neon PostgreSQL, containing the host, port, credentials, and database name. Used by Prisma and TypeORM clients to connect to the database.

### JWT_SECRET
*   **Where it is used**: `backend/src/auth/auth.module.ts`, `backend/src/auth/strategies/jwt.strategy.ts`
*   **Purpose**: A secure, randomly generated string used to sign and verify JSON Web Tokens (JWT) for authentication.

### JWT_EXPIRATION
*   **Where it is used**: `backend/src/auth/auth.module.ts`
*   **Purpose**: Defines the expiration period/duration for issued JWT tokens (e.g., `1d`). (Note: The application uses `JWT_EXPIRATION` instead of `JWT_EXPIRES_IN`).

### PORT
*   **Where it is used**: `backend/src/main.ts`, `backend/src/server.ts`
*   **Purpose**: Specifies the network port the application will bind to and listen on in production (Render injects this dynamically).

### NODE_ENV
*   **Where it is used**: `backend/src/app.module.ts`
*   **Purpose**: Sets the environment context (e.g., `production`). Used to determine if TypeORM must connect via SSL and disable schema synchronization.

---

## Specifically Checked Variables

*   **DATABASE_URL**: **Required**. Configured in Prisma and TypeORM modules.
*   **JWT_SECRET**: **Required**. Configured in the authentication module.
*   **JWT_EXPIRES_IN**: **Not used**. The application instead reads and validates **`JWT_EXPIRATION`** for token lifecycle configuration.
*   **PORT**: **Required**. Dynamically processed by the server bootstrap commands.
*   **CORS_ORIGIN**: **Not used**. CORS is currently configured to allow all origins (`*`) via `app.enableCors()` with no restriction.
*   **NODE_ENV**: **Required**. Used to toggle production-specific database settings (SSL and synchronization deactivation).


