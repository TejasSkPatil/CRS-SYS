# 🌌 Aether CRM & ERP System

An enterprise-grade, glassmorphism-designed Mini-CRM and ERP system featuring role-restricted views, automated inventory ledger trace, and a robust delivery challan lifecycle management flow.

Built with **NestJS & TypeORM** (Core Backend), **Prisma 7 & PgAdapter** (Database Client), and **Vite, React & TypeScript** (Frontend) powered by a dark-mode styled UI.

---

## 🛠️ Tech Stack & Features

*   **Frontend**: React 19, TypeScript, Vite, React Router, Axios, Lucide Icons.
*   **Backend Framework**: NestJS (for production CRM/ERP architecture) & Express (auxiliary developer testing server).
*   **Database & ORMs**: PostgreSQL, TypeORM (for schema migrations/synchronization), Prisma 7 with Native Postgres PgAdapter (for high-speed client-side queries).
*   **Styling**: Custom Vanilla CSS with modern Glassmorphism dark-mode aesthetics, rich gradients, and micro-animations.
*   **Security**: JWT-based Authentication, Role-based Route & Action guards.

---

## 📂 Project Structure

```
CRM/
├── backend/                  # NestJS & Express Backend Project
│   ├── src/
│   │   ├── main.ts           # NestJS production entry point (Port 8001)
│   │   ├── server.ts         # Express dev/test server entry point (Port 8001)
│   │   ├── app.module.ts     # Main NestJS module
│   │   ├── lib/
│   │   │   └── prisma.ts     # Prisma 7 client connection setup (with PgPool adapter)
│   │   ├── generated/prisma  # Prisma generated type-safe client
│   │   ├── auth/             # Authentication & Guards module
│   │   ├── users/            # User administration module
│   │   ├── customers/        # Customer CRM accounts module
│   │   ├── products/         # Product catalog module
│   │   ├── challans/         # Challan lifecycle management module
│   │   └── stock-movements/  # Ledger ledger tracking module
│   ├── prisma/
│   │   └── schema.prisma     # Prisma DB Schema definition
│   ├── .env                  # Environment configuration
│   └── tsconfig.json         # TS configuration with ESM/NodeNext
├── frontend/                 # Vite + React Frontend Project
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts     # Axios client configuration (Points to port 8001)
│   │   ├── main.tsx          # React application entry point
│   │   └── ...               # React views & components
│   └── package.json
├── docker-compose.yml        # Docker compose definition for PostgreSQL
└── postman_collection.json   # Exported Postman API test collection
```

---

## 🚀 Quick Start Guide

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18.x or later recommended)
*   [Docker](https://www.docker.com/) & Docker Compose

### 1. Database Setup
Start the local PostgreSQL container using Docker Compose:
```bash
docker compose up -d
```
*The database will start on `localhost:5432` with username `erp_admin`, password `erp_password`, and database name `mini_erp_crm`.*

### 2. Backend Installation & Setup
Navigate to the `backend` folder and set up environment variables:
```bash
cd backend
```

Create/verify your `.env` configuration:
```env
PORT=8001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=erp_admin
DB_PASSWORD=erp_password
DB_DATABASE=mini_erp_crm
DATABASE_URL="postgresql://erp_admin:erp_password@localhost:5432/mini_erp_crm"
JWT_SECRET=super-secret-crm-erp-key-change-in-prod
JWT_EXPIRATION=1d
```

Install packages and generate the Prisma client:
```bash
npm install
npx prisma generate
```

Now, choose your runner:
*   **Run NestJS production backend** (runs watch mode on Port `8001`):
    ```bash
    npm run start:dev
    ```
*   **Run auxiliary Express development server** (runs on Port `8001`):
    ```bash
    npm run dev
    ```

> 💡 **Automatic Database Seeding**: On startup, TypeORM automatically synchronizes the tables. The NestJS server checks for existing records, and automatically seeds default credentials, customers, and product items if they are missing.

### 3. Frontend Installation & Run
Go to the `frontend` folder, install dependencies, and start Vite:
```bash
cd ../frontend
npm install
npm run dev
```
Open **`http://localhost:5173`** in your browser.

---

## 👥 Seeded Logins (Demo Accounts)

You can click the preset credentials shortcuts on the Login Page, or enter them manually:

| Role | Username | Password | Purpose & Capabilities |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin` | `admin123` | Control panel, full visibility, create users, modify catalogs & customers. |
| **Sales** | `sales` | `sales123` | Create new customers, create draft challans for assigned accounts. |
| **Warehouse** | `warehouse` | `warehouse123` | Record stock updates, view stock movement logs, dispatch draft challans. |
| **Accounts** | `accounts` | `accounts123` | View customer ledger balances, bill delivered challans. |

---

## 🔄 Delivery Challan Lifecycle Workflow

The system enforces a strict state machine to maintain accurate product stock counts and customer balances:

```mermaid
stateDiagram-v2
    [*] --> Draft : Sales creates order
    Draft --> Delivered : Warehouse dispatches stock\n(Atomically triggers OUT Stock Movement)
    Delivered --> Invoiced : Accounts bill invoice\n(Atomically increments customer balance)
    Draft --> Cancelled : Cancel draft (No stock/balance effect)
    Delivered --> Cancelled : Cancel delivery (Reverses stock count + IN Stock Movement)
    Invoiced --> Cancelled : Cancel billing (Reverses stock count + Decrements customer balance)
```

1.  **Draft**: Created by **Sales** outlining sold products. No stock or financial impact.
2.  **Delivered**: Checked and marked by the **Warehouse**. Decreases stock count automatically and registers a **Stock Movement (OUT)** log.
3.  **Invoiced**: Finalized by **Accounts**. Increases the customer's outstanding balance ledger by the total amount.
4.  **Cancelled**: Can be done by **Admin** or authorized users. Cancelling a `Delivered` or `Invoiced` challan triggers automatic inventory restocking (IN movement) and ledger reversals.

---

## 📡 API Testing
You can import the `postman_collection.json` file in root directly into **Postman** to test and verify all the authentication, user, client, product, challan, and stock management endpoints.
